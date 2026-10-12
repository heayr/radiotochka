"use client";

import { useState, useEffect, useCallback } from "react";
import { getUsers } from "@/lib/actions/admin-actions";
import { Pagination } from "@/app/components/ui/Pagination";
import Button from "@/app/components/ui/Button";
import type { UserListItem, Pagination as PaginationType } from "@/types/user";
import { UsersFilters } from "./UsersFilters";
import { UsersTable } from "./UsersTable";
import { CreateUserModal } from "./CreateUserModal";

interface UsersListProps {
  currentUserRole?: string;
}

export default function UsersList({ currentUserRole = "admin" }: UsersListProps) {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    const result = await getUsers({
      page: pagination.page,
      limit: pagination.limit,
      search: search || undefined,
      role: roleFilter || undefined,
    });

    if (result.users) {
      setUsers(result.users as UserListItem[]);
      setPagination(result.pagination as PaginationType);
    }
    setIsLoading(false);
  }, [pagination.page, pagination.limit, search, roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadUsers();
  };

  const handleRoleChange = (value: string) => {
    setRoleFilter(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-950 tracking-tight">
            Управление пользователями
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Просмотр, создание и управление учетными записями
          </p>
        </div>
        <div>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Добавить пользователя
          </Button>
        </div>
      </div>

      <UsersFilters
        search={search}
        roleFilter={roleFilter}
        onSearchChange={setSearch}
        onRoleChange={handleRoleChange}
        onSubmit={handleSearch}
      />
      <UsersTable users={users} isLoading={isLoading} />
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadUsers}
        currentUserRole={currentUserRole}
      />
    </div>
  );
}
