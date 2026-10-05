import { db } from "@/lib/db";

export async function getContentBlock(slug: string) {
  try {
    return await db.contentBlock.findUnique({ where: { slug } });
  } catch (error) {
    console.error(`Error fetching content block "${slug}":`, error);
    return null;
  }
}

export async function getContentBlocks() {
  try {
    return await db.contentBlock.findMany({ orderBy: { updatedAt: "desc" } });
  } catch (error) {
    console.error("Error fetching content blocks:", error);
    return [];
  }
}

export async function getContentBlockSafe<T>(slug: string, fallback: T): Promise<T> {
  try {
    const block = await db.contentBlock.findUnique({ where: { slug } });
    if (!block || !block.content || typeof block.content !== "object") {
      return fallback;
    }
    const data = block.content as Record<string, unknown>;
    // If block content has items or required keys, return it
    if (Object.keys(data).length === 0) {
      return fallback;
    }
    return { ...fallback, ...data } as T;
  } catch (error) {
    console.warn(`[ContentService] DB unavailable or block "${slug}" missing, using fallback:`, error);
    return fallback;
  }
}

export async function upsertContentBlock(data: {
  slug: string;
  title: string;
  content: Record<string, unknown>;
  status?: string;
}) {
  return db.contentBlock.upsert({
    where: { slug: data.slug },
    update: {
      title: data.title,
      content: data.content as never,
      status: (data.status || "published") as never,
      version: { increment: 1 },
    },
    create: {
      slug: data.slug,
      title: data.title,
      content: data.content as never,
      status: (data.status || "published") as never,
      version: 1,
    },
  });
}

export async function updateContentBlock(
  slug: string,
  data: Record<string, unknown>,
) {
  return db.contentBlock.update({ where: { slug }, data: data as never });
}

export async function deleteContentBlock(slug: string) {
  return db.contentBlock.delete({ where: { slug } });
}

