import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface UserSummaryData {
  orderCount: number;
  orderTotal: number;
}

interface Props {
  userId: number;
}

export default function UserSummary({ userId }: Props) {
  const { data, isLoading, isError } = useQuery<UserSummaryData>({
    queryKey: ["user-summary", userId],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/challenge1/user-summary/${userId}`)
        .then((res) => res.data),
  });

  if (isLoading) return <p>Loading summary...</p>;
  if (isError) return <p>Error loading summary</p>;

  return (
    <div className="mt-4 p-4 border rounded shadow-sm bg-gray-50">
      <h2 className="text-lg font-semibold mb-2">User Summary</h2>
      <p>Orders: {data?.orderCount ?? 0}</p>
      <p>Total Amount: ${data?.orderTotal ?? 0}</p>
    </div>
  );
}
