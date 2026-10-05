"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { updateContentBlock, seedDefaultContentBlocks } from "@/lib/actions/admin-actions";
import Button from "@/app/components/Button";
import type { ContentBlock } from "@/types/content";
import { StatusBadge } from "@/app/components/ui/StatusBadge";
import { STATUS_LABELS, STATUS_COLORS } from "@/constants/statuses";
import type { EditorProps } from "./editors/editor-types";
import { LogoSectionEditor } from "./editors/LogoSectionEditor";
import { ServicesEditor } from "./editors/ServicesEditor";
import { WorkEditor } from "./editors/WorkEditor";
import { ProcessEditor } from "./editors/ProcessEditor";
import { StatsEditor } from "./editors/StatsEditor";
import { ManifestoEditor } from "./editors/ManifestoEditor";
import { CasesEditor } from "./editors/CasesEditor";
import { ProposalEditor } from "./editors/ProposalEditor";
import { JsonEditor } from "./editors/JsonEditor";
import { CreateContentBlock } from "./editors/CreateContentBlock";

interface ContentListProps {
  blocks: ContentBlock[];
  canCreate: boolean;
}

const editorMap: Record<string, React.ComponentType<EditorProps>> = {
  services: ServicesEditor,
  work: WorkEditor,
  process: ProcessEditor,
  stats: StatsEditor,
  manifesto: ManifestoEditor,
  "logo-section": LogoSectionEditor,
  cases: CasesEditor,
  proposal: ProposalEditor,
};

export default function ContentList({ blocks, canCreate }: ContentListProps) {
  const router = useRouter();
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

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
        "Инициализировать или обновить все блоки (Услуги, Проекты, Процесс, Цифры, Манифест) дефолтными карточками с сайта?",
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
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
          <div>
            <h3 className="font-extrabold text-xl text-gray-900">
              Редактирование: {editingBlock.title}
            </h3>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              slug: {editingBlock.slug}
            </p>
          </div>
          <button
            onClick={handleCancel}
            type="button"
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            ✕ Закрыть
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
      {/* Верхняя панель управления */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-gray-900">
            Контентные блоки сайта
          </h2>
          <p className="text-xs text-gray-500">
            Изменения вступают в силу на сайте сразу после сохранения.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSyncing}
            onClick={handleSyncDefaults}
          >
            {isSyncing ? "Синхронизация..." : "⚡ Загрузить карточки с сайта в базу"}
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

      {/* Список блоков */}
      <div className="grid gap-4">
        {blocks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center space-y-4">
            <p className="text-gray-500 text-base">
              В подключенной базе данных пока нет контентных блоков.
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
                : "⚡ Создать все блоки (Услуги, Кейсы, Процесс, Цифры)"}
            </Button>
          </div>
        ) : (
          blocks.map((block) => (
            <div
              key={block.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-bold text-gray-900">
                    {block.title}
                  </h3>
                  <StatusBadge
                    label={STATUS_LABELS[block.status] || block.status}
                    colorClass={
                      STATUS_COLORS[block.status] || STATUS_COLORS.draft
                    }
                  />
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                    slug: {block.slug}
                  </span>
                  <span>версия: v{block.version}</span>
                  <span>
                    изменено: {new Date(block.updatedAt).toLocaleString("ru-RU")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setEditingBlock(block)}
                  variant="primary"
                  size="sm"
                >
                  Редактировать карточки
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
