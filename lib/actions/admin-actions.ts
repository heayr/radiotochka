"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { adminUpdateUserSchema, contentBlockSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";
import { requireRole, requireAdmin } from "@/lib/auth-helpers";
import * as userService from "@/lib/services/user.service";
import * as contentService from "@/lib/services/content.service";
import {
  DEFAULT_SERVICES_DATA,
  DEFAULT_WORK_DATA,
  DEFAULT_PROCESS_DATA,
  DEFAULT_STATS_DATA,
  DEFAULT_MANIFESTO_DATA,
} from "@/types/site-content";

export async function getUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) {
  await requireRole(["super_admin", "admin"]);
  return userService.getUsers(params);
}

export async function getUserById(id: string) {
  await requireRole(["super_admin", "admin"]);
  const user = await userService.findUserById(id);
  if (!user) return { error: "Пользователь не найден" };
  return { user };
}

export async function updateUser(
  id: string,
  input: {
    name?: string;
    role?: string;
    isActive?: boolean;
    emailVerified?: boolean;
  },
) {
  const session = await requireRole(["super_admin", "admin"]);

  const validated = adminUpdateUserSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Ошибка валидации" };
  }

  const targetUser = await userService.findUserById(id);
  if (!targetUser) return { error: "Пользователь не найден" };

  if (input.role && session.user.role !== "super_admin") {
    return { error: "Недостаточно прав для изменения роли" };
  }

  const data: Record<string, unknown> = {};
  if (validated.data.name !== undefined) data.name = validated.data.name;
  if (validated.data.role !== undefined) data.role = validated.data.role;
  if (validated.data.isActive !== undefined)
    data.isActive = validated.data.isActive;
  if (validated.data.emailVerified !== undefined) {
    data.emailVerified = validated.data.emailVerified ? new Date() : null;
  }

  await userService.updateUser(id, data);

  await createAuditLog({
    userId: session.user.id,
    action: "user_update",
    entity: "user",
    entityId: id,
    metadata: { changes: validated.data },
  });

  return { success: true, message: "Пользователь обновлён" };
}

export async function getContentBlocks() {
  await requireAdmin();
  const blocks = await contentService.getContentBlocks();
  return { blocks };
}

export async function getContentBlockBySlug(slug: string) {
  await requireAdmin();
  const block = await contentService.getContentBlock(slug);
  if (!block) return { error: "Блок не найден" };
  return { block };
}

export async function updateContentBlock(
  slug: string,
  input: {
    title?: string;
    content?: unknown;
    status?: string;
  },
) {
  const session = await requireAdmin();

  const title =
    input.title ||
    (input.content as Record<string, unknown>)?.title ||
    slug;
  const validated = contentBlockSchema.safeParse({
    slug,
    title: String(title),
    content: input.content,
    status: input.status,
  });
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Ошибка валидации" };
  }

  const updatedBlock = await contentService.upsertContentBlock({
    slug,
    title: validated.data.title,
    content: (validated.data.content as Record<string, unknown>) || {},
    status: (validated.data.status as string) || "published",
  });

  revalidatePath("/");
  revalidatePath("/admin/content");

  await createAuditLog({
    userId: session.user.id,
    action: "content_update",
    entity: "content",
    entityId: updatedBlock.id,
    metadata: { slug, version: updatedBlock.version },
  });

  return { success: true, message: "Контент обновлён на сайте в реальном времени" };
}

export async function seedDefaultContentBlocks() {
  await requireAdmin();

  const blocksToSeed = [
    {
      slug: "services",
      title: "Услуги (Services Stacking Cards)",
      content: DEFAULT_SERVICES_DATA as unknown as Record<string, unknown>,
      status: "published",
    },
    {
      slug: "work",
      title: "Кейсы и Проекты (Work)",
      content: DEFAULT_WORK_DATA as unknown as Record<string, unknown>,
      status: "published",
    },
    {
      slug: "process",
      title: "Этапы работы (Process)",
      content: DEFAULT_PROCESS_DATA as unknown as Record<string, unknown>,
      status: "published",
    },
    {
      slug: "stats",
      title: "Цифры и фото студии (Stats)",
      content: DEFAULT_STATS_DATA as unknown as Record<string, unknown>,
      status: "published",
    },
    {
      slug: "manifesto",
      title: "Манифест агентства (Manifesto)",
      content: DEFAULT_MANIFESTO_DATA as unknown as Record<string, unknown>,
      status: "published",
    },
  ];

  for (const block of blocksToSeed) {
    await contentService.upsertContentBlock(block);
  }

  revalidatePath("/");
  revalidatePath("/admin/content");

  return { success: true, message: "Все карточки и фото успешно инициализированы в базе данных!" };
}

export async function createContentBlock(input: {
  slug: string;
  title: string;
  content?: unknown;
  status?: string;
}) {
  const session = await requireRole(["super_admin", "admin"]);

  const validated = contentBlockSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Ошибка валидации" };
  }

  const existing = await contentService.getContentBlock(validated.data.slug);
  if (existing) return { error: "Блок с таким slug уже существует" };

  await contentService.createContentBlock({
    slug: validated.data.slug,
    title: validated.data.title,
    content: validated.data.content as Record<string, unknown>,
    status: (validated.data.status as string) || "draft",
  });

  await createAuditLog({
    userId: session.user.id,
    action: "content_create",
    entity: "content",
    metadata: { slug: validated.data.slug },
  });

  return { success: true, message: "Блок создан" };
}

export async function getAuditLogs(params: {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
}) {
  await requireRole(["super_admin", "admin"]);

  const { db } = await import("@/lib/db");

  const page = params.page || 1;
  const limit = params.limit || 50;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (params.userId) where.userId = params.userId;
  if (params.action) where.action = params.action;

  const [logs, total] = await Promise.all([
    db.auditLog.findMany({
      where,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.auditLog.count({ where }),
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}