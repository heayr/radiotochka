import React from "react";
import { auth } from "@/auth";
import { AdminNav } from "./AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNav
        user={
          session?.user
            ? {
                name: session.user.name,
                email: session.user.email,
                role: session.user.role,
              }
            : undefined
        }
      />
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
}
