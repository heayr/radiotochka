"use client";

import { signOut } from "next-auth/react";
import Button from "@/app/components/ui/Button";
import TwoFactorSetup from "@/app/components/auth/TwoFactorSetup";

export function SecurityCard() {
  return (
    <>
      <div className="mb-6">
        <TwoFactorSetup />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          variant="outline"
          size="md"
        >
          Выйти из системы
        </Button>
      </div>
    </>
  );
}
