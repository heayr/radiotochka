import React, { memo } from "react";
import Badge from "./Badge";

interface StatusBadgeProps {
  label: string;
  colorClass: string;
  extra?: string;
}

export const StatusBadge = memo(function StatusBadge({
  label,
  colorClass,
  extra,
}: StatusBadgeProps) {
  return (
    <span className="flex items-center gap-2">
      <Badge className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {label}
      </Badge>
      {extra && <span className="text-xs text-gray-400">{extra}</span>}
    </span>
  );
});
