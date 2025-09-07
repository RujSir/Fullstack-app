import React, { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDebounce } from "use-debounce";
import { format } from "date-fns";

export interface UserRow {
  id: number;
  name: string;
  email: string;
  createAt: string;
  orderCount: number;
  orderTotal: number;
}

export interface UserData {
  items: UserRow[];
  total: number;
  page: number;
  pageSize: number;
}

interface UserTableProps {
  onSelectUser?: (userId: number) => void; 
}

export default function UserTable({ onSelectUser }: UserTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof UserRow>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [debouncedSearch] = useDebounce(search, 250);

  const { data, isLoading, isError, isFetching } = useQuery<UserData>({
    queryKey: ["users", page, pageSize, debouncedSearch, sortBy, sortDir],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/challenge1/users`, {
        params: { page, pageSize, search: debouncedSearch, sortBy, sortDir },
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const handleSort = useCallback((col: keyof UserRow) => {
    setSortBy(col);
    setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const totalPages = useMemo(() => {
    if (!data) return 0;
    return Math.ceil(data.total / pageSize);
  }, [data, pageSize]);

  function formatDate(value: string | undefined) {
  if (!value) return "-";
  const date = new Date(value);
  return isNaN(date.getTime()) ? "-" : format(date, "yyyy-MM-dd");
}

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or email..."
          className="p-2 border rounded shadow-sm"
        />
        {(isLoading || isFetching) && <span>Loading...</span>}
        {isError && <span>Error loading data</span>}
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {["name", "email", "createdAt", "orderTotal"].map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col as keyof UserRow)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer text-center"
                >
                  {col.replace(/([A-Z])/g, " $1").trim()}{" "}
                  {sortBy === col && (sortDir === "asc" ? "↑" : "↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.items.map((user, idx) => (
              <tr
                key={user.id}
                onClick={() => onSelectUser?.(user.id)}
                className={
                  idx % 2 === 0
                    ? "bg-gray-50 hover:bg-gray-100 cursor-pointer"
                    : "hover:bg-gray-100 cursor-pointer"
                }
              >
                <td className="px-6 py-4 text-sm text-center font-medium">{user.name}</td>
                <td className="px-6 py-4 text-sm text-center">{user.email}</td>
                <td className="px-6 py-4 text-sm text-center">{formatDate(user.createAt)}</td>

                <td className="px-6 py-4 text-sm text-center">{user.orderTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1 || isFetching}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages || isFetching}
        >
          Next
        </button>
      </div>
    </div>
  );
}
