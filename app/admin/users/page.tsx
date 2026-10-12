import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UsersList from "./UsersList";

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (!["super_admin", "admin"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <UsersList currentUserRole={session.user.role} />
    </div>
  );
}
