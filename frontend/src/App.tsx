import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserTable from "./components/UserTable";
import UserOrdersTable from "./components/UserOrdersTable";
import UserSummary from "./components/UserSummary";
import { useState } from "react";

const queryClient = new QueryClient();

export default function App() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">User Data Dashboard</h1>
       <UserTable onSelectUser={(id) => setSelectedUserId(id)} />
        {selectedUserId && (
          <>
            <UserSummary userId={selectedUserId} />
            <UserOrdersTable userId={selectedUserId} />
          </>
        )}
      </div>
    </QueryClientProvider>
  );
}
