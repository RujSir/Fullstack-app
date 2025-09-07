import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Order {
  id: number;
  userId: number;
  productName: string;
  amount: number;
  createdAt: string;
}

interface OrderData {
  items: Order[];
  total: number;
  page: number;
  pageSize: number;
}

export interface OrderRow {
  id: number;
  userId: number;
  productName: string;
  amount: number;
  createAt: string;
}

export interface UserOrdersData {
  items: OrderRow[];
  total: number;
  page: number;
  pageSize: number;
}

interface Props {
  userId: number;
}

export default function UserOrdersTable({ userId }: Props) {
  const [page, setPage] = useState(1);
  const pageSize = 20;

const { data, isLoading, isError } = useQuery<UserOrdersData>({
  queryKey: ["orders", userId, page, pageSize],
  queryFn: () =>
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/challenge1/orders`, {
        params: { userId, page, pageSize },
      })
      .then((res) => res.data),
});

  if (isLoading) return <p>Loading orders...</p>;
  if (isError) return <p>Error loading orders</p>;

  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Orders for User {userId}</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-center">ID</th>
            <th className="px-4 py-2 text-center">Product</th>
            <th className="px-4 py-2 text-center">Amount</th>
            <th className="px-4 py-2 text-center">Created At</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data?.items.map((order, idx) => (
            <tr
              key={order.id}
              className={idx % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-100"}
            >
              <td className="px-4 py-2 text-center">{order.id}</td>
              <td className="px-4 py-2 text-center">{order.productName}</td>
              <td className="px-4 py-2 text-center">{order.amount}</td>
              <td className="px-4 py-2 text-center">{new Date(order.createAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-2">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
