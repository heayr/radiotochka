import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  DEFAULT_HERO_DATA,
  DEFAULT_STATS_DATA,
  DEFAULT_MARQUEE_DATA,
  DEFAULT_MANIFESTO_DATA,
  DEFAULT_PROCESS_DATA,
  DEFAULT_SERVICES_DATA,
  DEFAULT_WORK_DATA,
  DEFAULT_FOOTER_DATA,
  DEFAULT_LOGO_SECTION_DATA,
} from "../types/site-content";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Начало сидинга...");

  // Создаём супер-админа
  const adminEmail = "admin@radiotochka.example.com";
  const adminPassword = "REDACTED_ADMIN_PASSWORD";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("⚠️  Супер-администратор уже существует, пропускаем...");
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    await prisma.user.create({
      data: {
        name: "Супер-Администратор",
        email: adminEmail,
        password: hashedPassword,
        role: "super_admin",
        emailVerified: new Date(),
        isActive: true,
      },
    });

    console.log(`✅ Супер-администратор создан:`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
  }

  // Создаём контентные блоки по умолчанию (все 8 актуальных секций сайта)
  const defaultBlocks = [
    {
      slug: "hero",
      title: "1. Главный экран (Hero)",
      content: DEFAULT_HERO_DATA as unknown as Record<string, unknown>,
      status: "published" as const,
    },
    {
      slug: "stats",
      title: "2. Цифры и студия (Stats)",
      content: DEFAULT_STATS_DATA as unknown as Record<string, unknown>,
      status: "published" as const,
    },
    {
      slug: "marquee",
      title: "3. Бегущая строка (Marquee)",
      content: DEFAULT_MARQUEE_DATA as unknown as Record<string, unknown>,
      status: "published" as const,
    },
    {
      slug: "manifesto",
      title: "4. Манифест агентства (Manifesto)",
      content: DEFAULT_MANIFESTO_DATA as unknown as Record<string, unknown>,
      status: "published" as const,
    },
    {
      slug: "logo-section",
      title: "5. Клиенты и логотипы (LogoSection)",
      content: DEFAULT_LOGO_SECTION_DATA as unknown as Record<string, unknown>,
      status: "published" as const,
    },
    {
      slug: "process",
      title: "6. Этапы работы (Process)",
      content: DEFAULT_PROCESS_DATA as unknown as Record<string, unknown>,
      status: "published" as const,
    },
    {
      slug: "services",
      title: "7. Услуги (Services Stacking Cards)",
      content: DEFAULT_SERVICES_DATA as unknown as Record<string, unknown>,
      status: "published" as const,
    },
    {
      slug: "work",
      title: "8. Кейсы и Проекты (Work)",
      content: DEFAULT_WORK_DATA as unknown as Record<string, unknown>,
      status: "published" as const,
    },
    {
      slug: "footer",
      title: "9. Контакты и подвал (Footer)",
      content: DEFAULT_FOOTER_DATA as unknown as Record<string, unknown>,
      status: "published" as const,
    },
  ];

  for (const block of defaultBlocks) {
    await prisma.contentBlock.upsert({
      where: { slug: block.slug },
      update: {
        title: block.title,
        content: block.content as any,
        status: block.status,
      },
      create: {
        slug: block.slug,
        title: block.title,
        content: block.content as any,
        status: block.status,
      },
    });
    console.log(`✅ Блок "${block.slug}" сохранён`);
  }

  // Удаляем устаревшие блоки старого шаблона
  const obsoleteSlugs = ["cases", "proposal"];
  for (const slug of obsoleteSlugs) {
    try {
      await prisma.contentBlock.delete({ where: { slug } });
      console.log(`🗑️  Устаревший блок "${slug}" удалён`);
    } catch {
      // Игнорируем если уже удалён
    }
  }

  console.log("\n🎉 Сидинг завершён!");
}

main()
  .catch((e) => {
    console.error("❌ Ошибка сидинга:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });