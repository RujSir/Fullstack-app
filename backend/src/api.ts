import express, { type Request, type Response } from "express";
import { z } from "zod";
import { users, orders, userSummaries } from "./data.js";

const router = express.Router();

// ---------- Challenge 1: Get users ----------
const userQuerySchema = z.object({
  page: z.string().transform(Number).default(1),
  pageSize: z
    .string()
    .transform(Number)
    .default(50)
    .refine((size) => size <= 200),
  search: z.string().optional(),
  sortBy: z.enum(["name", "email", "createdAt", "orderTotal"]).default("name"),
  sortDir: z.enum(["asc", "desc"]).default("asc"),
});

router.get("/users", (req: Request, res: Response) => {
  try {
    const { page, pageSize, search, sortBy, sortDir } = userQuerySchema.parse(
      req.query
    );

    let filteredUsers = users.filter(
      (u) =>
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    // Sort
    filteredUsers.sort((a, b) => {
      const aVal =
        sortBy === "orderTotal"
          ? userSummaries.get(a.id)?.orderTotal || 0
          : (a as any)[sortBy];
      const bVal =
        sortBy === "orderTotal"
          ? userSummaries.get(b.id)?.orderTotal || 0
          : (b as any)[sortBy];

      if (typeof aVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });

    // Pagination
    const total = filteredUsers.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = filteredUsers.slice(start, end).map((u) => ({
      ...u,
      orderCount: userSummaries.get(u.id)?.orderCount || 0,
      orderTotal: userSummaries.get(u.id)?.orderTotal || 0,
    }));

    res.json({ items, total, page, pageSize });
  } catch {
    res.status(400).json({ message: "Validation failed" });
  }
});

// ---------- Challenge 2: Get orders ----------
const orderQuerySchema = z.object({
  userId: z.string().transform(Number),
  page: z.string().transform(Number).default(1),
  pageSize: z.string().transform(Number).default(20),
});

router.get("/orders", (req: Request, res: Response) => {
  try {
    const { userId, page, pageSize } = orderQuerySchema.parse(req.query);
    const userOrders = orders.filter((o) => o.userId === userId);

    const total = userOrders.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = userOrders.slice(start, end);

    res.json({ items, total, page, pageSize });
  } catch {
    res.status(400).json({ message: "Validation failed" });
  }
});

// ---------- Challenge 3: User summary ----------
router.get("/user-summary/:userId", (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const summary = userSummaries.get(userId) || { orderCount: 0, orderTotal: 0 };
  console.log("🚀 ~ summary:", summary);
  res.json(summary);
});

export default router;
