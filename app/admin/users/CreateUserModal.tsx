"use client";

import React, { useState } from "react";
import Button from "@/app/components/ui/Button";
import { createAdminUser } from "@/lib/actions/admin-actions";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentUserRole?: string;
}

export function CreateUserModal({
  isOpen,
  onClose,
  onSuccess,
  currentUserRole = "admin",
}: CreateUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"super_admin" | "admin" | "moderator" | "user">("user");
  const [emailVerified, setEmailVerified] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGeneratePassword = () => {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
    let generated = "";
    for (let i = 0; i < 12; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
    setShowPassword(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await createAdminUser({
        name,
        email,
        password,
        role,
        emailVerified,
      });

      if (res.error) {
        setError(res.error);
        setIsLoading(false);
        return;
      }

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      setEmailVerified(true);
      setIsLoading(false);
      onSuccess();
      onClose();
    } catch {
      setError("Произошла непредвиденная ошибка при создании пользователя");
      setIsLoading(false);
    }
  };

  const isSuperAdmin = currentUserRole === "super_admin";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Добавить пользователя
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Создание учётной записи вручную через панель управления
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors text-base"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
            <span className="font-semibold text-red-500">Ошибка:</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
              Имя пользователя <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Константин Константинов"
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea5670]/40 focus:border-[#ea5670] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
              Email адрес <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea5670]/40 focus:border-[#ea5670] transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                Пароль <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="text-xs text-[#ea5670] hover:underline font-medium"
              >
                🎲 Сгенерировать
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Минимум 6 символов"
                className="w-full px-4 py-2.5 pr-10 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea5670]/40 focus:border-[#ea5670] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                {showPassword ? "Скрыть" : "Показать"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
              Роль в системе
            </label>
            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "super_admin" | "admin" | "moderator" | "user")
              }
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea5670]/40 focus:border-[#ea5670] transition-all"
            >
              {isSuperAdmin && (
                <>
                  <option value="super_admin">Главный администратор (super_admin)</option>
                  <option value="admin">Администратор (admin)</option>
                </>
              )}
              <option value="moderator">Модератор контента (moderator)</option>
              <option value="user">Обычный пользователь (user)</option>
            </select>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer text-sm text-gray-700">
              <input
                type="checkbox"
                checked={emailVerified}
                onChange={(e) => setEmailVerified(e.target.checked)}
                className="w-4 h-4 rounded text-[#ea5670] border-gray-300 focus:ring-[#ea5670]"
              />
              <span className="select-none text-xs text-gray-600">
                Email сразу подтверждён (аккаунт готов к входу без письма с токеном)
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading}
            >
              {isLoading ? "Создание..." : "Создать пользователя"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
