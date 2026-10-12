import { redirect } from "next/navigation";

/**
 * Корневой роут админ-панели /admin.
 * Автоматически перенаправляет в редактор контента /admin/content.
 */
export default function AdminPage() {
  redirect("/admin/content");
}
