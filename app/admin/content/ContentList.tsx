"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  updateContentBlock,
  seedDefaultContentBlocks,
} from "@/lib/actions/admin-actions";
import Button from "@/app/components/Button";
import type { ContentBlock } from "@/types/content";
import { StatusBadge } from "@/app/components/ui/StatusBadge";
import { STATUS_LABELS, STATUS_COLORS } from "@/constants/statuses";
import type { EditorProps } from "./editors/editor-types";

import { HeroEditor } from "./editors/HeroEditor";
import { StatsEditor } from "./editors/StatsEditor";
import { MarqueeEditor } from "./editors/MarqueeEditor";
import { ManifestoEditor } from "./editors/ManifestoEditor";
import { ProcessEditor } from "./editors/ProcessEditor";
import { ServicesEditor } from "./editors/ServicesEditor";
import { WorkEditor } from "./editors/WorkEditor";
import { FooterEditor } from "./editors/FooterEditor";
import { JsonEditor } from "./editors/JsonEditor";
import { CreateContentBlock } from "./editors/CreateContentBlock";
import {
  DEFAULT_HERO_DATA,
  DEFAULT_STATS_DATA,
  DEFAULT_MARQUEE_DATA,
  DEFAULT_MANIFESTO_DATA,
  DEFAULT_PROCESS_DATA,
  DEFAULT_SERVICES_DATA,
  DEFAULT_WORK_DATA,
  DEFAULT_FOOTER_DATA,
} from "@/types/site-content";

interface ContentListProps {
  blocks: ContentBlock[];
  canCreate: boolean;
}

const editorMap: Record<string, React.ComponentType<EditorProps>> = {
  hero: HeroEditor,
  stats: StatsEditor,
  marquee: MarqueeEditor,
  manifesto: ManifestoEditor,
  process: ProcessEditor,
  services: ServicesEditor,
  work: WorkEditor,
  footer: FooterEditor,
};

const SECTION_INFO: Record<
  string,
  { icon: string; order: number; sectionName: string; summary: string }
> = {
  hero: {
    icon: "🌟",
    order: 1,
    sectionName: "Экран 1: Главный экран (Hero)",
    summary:
      "Верхний копирайт, лейбл агентства и плакатное SVG слово в градиенте.",
  },
  stats: {
    icon: "📊",
    order: 2,
    sectionName: "Экран 2: Цифры и студия (Stats)",
    summary:
      "3 ключевые метрики агентства, текстовый оффер, плашки и фото студии.",
  },
  marquee: {
    icon: "⚡",
    order: 3,
    sectionName: "Экран 3: Бегущая строка (Marquee)",
    summary:
      "Бесконечная бегущая лента с ключевыми направлениями и радиостанциями.",
  },
  manifesto: {
    icon: "💎",
    order: 4,
    sectionName: "Экран 4: Манифест агентства (Manifesto)",
    summary:
      "Цитата манифеста с анимацией слов по скроллу, стаж и города охвата.",
  },
  process: {
    icon: "🔄",
    order: 5,
    sectionName: "Экран 5: Этапы работы (Process)",
    summary:
      "4 карточки этапов (Брифинг, Медиаплан, Продакшн, Запуск) с фото и номерами.",
  },
  services: {
    icon: "📻",
    order: 6,
    sectionName: "Экран 6: Услуги (Services Stacking Cards)",
    summary:
      "3 полноэкранные стек-карточки (Радио, Билборды, Звук) + 3 нижние карточки.",
  },
  work: {
    icon: "🏆",
    order: 7,
    sectionName: "Экран 7: Кейсы и проекты (Work)",
    summary:
      "4 карточки реальных проектов (Оранж, ВолгаМоторс, Утёс, Премьер) с фото и тегами.",
  },
  footer: {
    icon: "📍",
    order: 8,
    sectionName: "Экран 8: Контакты и подвал (Footer)",
    summary:
      "Офис в Балаково, телефоны, email, соцсети (VK, TG) и реквизиты компании.",
  },
};

const CANONICAL_SECTIONS: Array<{
  slug: string;
  order: number;
  title: string;
  defaultContent: Record<string, unknown>;
}> = [
  { slug: "hero", order: 1, title: "1. Главный экран (Hero)", defaultContent: DEFAULT_HERO_DATA as unknown as Record<string, unknown> },
  { slug: "stats", order: 2, title: "2. Цифры и студия (Stats)", defaultContent: DEFAULT_STATS_DATA as unknown as Record<string, unknown> },
  { slug: "marquee", order: 3, title: "3. Бегущая строка (Marquee)", defaultContent: DEFAULT_MARQUEE_DATA as unknown as Record<string, unknown> },
  { slug: "manifesto", order: 4, title: "4. Манифест агентства (Manifesto)", defaultContent: DEFAULT_MANIFESTO_DATA as unknown as Record<string, unknown> },
  { slug: "process", order: 5, title: "5. Этапы работы (Process)", defaultContent: DEFAULT_PROCESS_DATA as unknown as Record<string, unknown> },
  { slug: "services", order: 6, title: "6. Услуги (Services Stacking Cards)", defaultContent: DEFAULT_SERVICES_DATA as unknown as Record<string, unknown> },
  { slug: "work", order: 7, title: "7. Кейсы и Проекты (Work)", defaultContent: DEFAULT_WORK_DATA as unknown as Record<string, unknown> },
  { slug: "footer", order: 8, title: "8. Контакты и подвал (Footer)", defaultContent: DEFAULT_FOOTER_DATA as unknown as Record<string, unknown> },
];

export default function ContentList({ blocks, canCreate }: ContentListProps) {
  const router = useRouter();
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Гарантируем отображение всех 8 основных экранов сайта в строгом порядке 1..8
  // Если блок ещё не был записан в БД, подставляем актуальные дефолтные данные — редактирование доступно мгновенно
  const sortedBlocks = useMemo(() => {
    const canonicalList: ContentBlock[] = CANONICAL_SECTIONS.map((canonical) => {
      const existing = blocks.find((b) => b.slug === canonical.slug);
      if (existing) {
        return existing;
      }
      return {
        id: `default-${canonical.slug}`,
        slug: canonical.slug,
        title: canonical.title,
        content: canonical.defaultContent,
        status: "published" as const,
        version: 1,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    // Дополнительные пользовательские блоки (исключаем устаревшие блоки из старого шаблона)
    const obsoleteSlugs = new Set(["cases", "proposal", "logo-section"]);
    const extraBlocks = blocks.filter(
      (b) => !SECTION_INFO[b.slug] && !obsoleteSlugs.has(b.slug),
    );

    return [...canonicalList, ...extraBlocks];
  }, [blocks]);

  const handleCancel = useCallback(() => setEditingBlock(null), []);

  const handleSave = useCallback(
    async (updated: Record<string, unknown>) => {
      if (!editingBlock) return;
      const result = await updateContentBlock(editingBlock.slug, {
        content: updated,
      });
      if (result.error) {
        alert(result.error);
        return;
      }
      setEditingBlock(null);
      router.refresh();
    },
    [editingBlock, router],
  );

  const handleSyncDefaults = async () => {
    if (
      !confirm(
        "Синхронизировать все 8 секций сайта (Hero, Stats, Marquee, Manifesto, Process, Services, Work, Footer) дефолтными актуальными данными и удалить старые блоки?",
      )
    ) {
      return;
    }

    setIsSyncing(true);
    try {
      const res = await seedDefaultContentBlocks();
      alert(res.message);
      router.refresh();
    } catch (e: any) {
      alert("Ошибка синхронизации: " + (e?.message || e));
    } finally {
      setIsSyncing(false);
    }
  };

  if (editingBlock) {
    const Editor = editorMap[editingBlock.slug] ?? JsonEditor;
    const info = SECTION_INFO[editingBlock.slug];

    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{info?.icon || "📝"}</span>
              <h3 className="font-extrabold text-xl text-gray-900">
                {info?.sectionName || editingBlock.title}
              </h3>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              slug: {editingBlock.slug} • версия: v{editingBlock.version}
            </p>
          </div>
          <button
            onClick={handleCancel}
            type="button"
            className="text-sm font-semibold text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            ✕ Закрыть редактор
          </button>
        </div>

        <Editor
          block={editingBlock}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Верхняя плашка управления */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-pink text-white text-xs font-bold">
              8
            </span>
            <h2 className="text-xl font-bold text-gray-900">
              Секции лендинга Радиоточки
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Редактируйте тексты, цифры, этапы и фотографии в реальном времени.
            Изменения сразу видны на сайте.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSyncing}
            onClick={handleSyncDefaults}
            className="border-gray-300 font-medium"
          >
            {isSyncing ? "Синхронизация..." : "⚡ Синхронизировать все 8 секций"}
          </Button>

          {canCreate && (
            <Button
              onClick={() => setShowCreate(!showCreate)}
              variant="primary"
              size="sm"
            >
              {showCreate ? "Отмена" : "+ Создать блок"}
            </Button>
          )}
        </div>
      </div>

      {showCreate && (
        <CreateContentBlock
          onCreated={() => {
            setShowCreate(false);
            router.refresh();
          }}
        />
      )}

      {/* Список секций в порядке отображения на лендинге */}
      <div className="grid gap-3.5">
        {sortedBlocks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center space-y-4">
            <p className="text-gray-500 text-base">
              В базе данных пока нет секций сайта.
            </p>
            <Button
              type="button"
              variant="primary"
              size="md"
              disabled={isSyncing}
              onClick={handleSyncDefaults}
            >
              {isSyncing
                ? "Синхронизация..."
                : "⚡ Создать все 8 секций сайта в один клик"}
            </Button>
          </div>
        ) : (
          sortedBlocks.map((block) => {
            const info = SECTION_INFO[block.slug];

            return (
              <div
                key={block.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-400 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl shrink-0">
                      {info?.icon || "📝"}
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                        {info?.sectionName || block.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {info?.summary || "Пользовательский блок контента"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <StatusBadge
                    label={STATUS_LABELS[block.status] || block.status}
                    colorClass={
                      STATUS_COLORS[block.status] || STATUS_COLORS.draft
                    }
                  />

                  <Button
                    onClick={() => setEditingBlock(block)}
                    variant="primary"
                    size="sm"
                    className="font-medium"
                  >
                    Редактировать
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
