"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getHistory, deleteEntry, getStarred, toggleStarred } from "@/lib/storage";
import type { MoodEntry, FoodSuggestion, ContentSuggestion, ActionSuggestion, FoodCategory, ContentCategory } from "@/lib/types";

type AccordionTab = "food" | "content" | "action";

const CONTENT_LABEL: Record<ContentCategory, string> = {
  movie: "映画", manga: "漫画", drama: "ドラマ", book: "本", music: "音楽",
};
const CONTENT_ICON: Record<ContentCategory, string> = {
  movie: "🎬", manga: "📖", drama: "📺", book: "📚", music: "🎵",
};
const FOOD_LABEL: Record<FoodCategory, string> = {
  meal: "料理", sweet: "スイーツ", drink: "ドリンク",
};
const FOOD_ICON: Record<FoodCategory, string> = {
  meal: "🍽️", sweet: "🍰", drink: "☕",
};

// ── Accordion content ───────────────────────────────────────────────────────

function AccordionBody({ entry, starred, onStarToggle }: {
  entry: MoodEntry;
  starred: Set<string>;
  onStarToggle: (id: string) => void;
}) {
  const [tab, setTab] = useState<AccordionTab>("food");
  const TABS: { key: AccordionTab; label: string; icon: string; count: number }[] = [
    { key: "food",    label: "食事",      icon: "🍽️", count: entry.food.length },
    { key: "content", label: "コンテンツ", icon: "🎬", count: entry.content.length },
    { key: "action",  label: "行動",      icon: "🚶", count: entry.action.length },
  ];

  return (
    <div style={{ borderTop: "1.5px solid rgba(163,177,138,0.22)", marginTop: "0.75rem", paddingTop: "0.75rem" }}>
      {/* タブ */}
      <div className="flex gap-1 mb-3 rounded-2xl p-1" style={{ backgroundColor: "rgba(163,177,138,0.10)" }}>
        {TABS.map(({ key, label, icon, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex-1 rounded-xl py-1.5 text-xs font-bold transition-all duration-150"
            style={{
              backgroundColor: tab === key ? "#FDFCF5" : "transparent",
              color: tab === key ? "#D35400" : "#A3B18A",
              boxShadow: tab === key ? "0 1px 6px rgba(163,177,138,0.18)" : "none",
            }}
          >
            {icon} {label}
            <span className="ml-1 opacity-60">{count}</span>
          </button>
        ))}
      </div>

      {/* 食事 */}
      {tab === "food" && (
        <ul className="flex flex-col gap-2">
          {entry.food.map((item: FoodSuggestion) => (
            <li key={item.id}>
              <div
                className="rounded-2xl px-4 py-3"
                style={{
                  backgroundColor: starred.has(item.id) ? "rgba(211,84,0,0.06)" : "rgba(163,177,138,0.08)",
                  border: `1px solid ${starred.has(item.id) ? "rgba(211,84,0,0.28)" : "rgba(163,177,138,0.22)"}`,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="text-base shrink-0">{FOOD_ICON[item.category]}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-bold rounded-full px-2 py-0.5" style={{ backgroundColor: "#D35400", color: "#FDFCF5" }}>
                          {FOOD_LABEL[item.category]}
                        </span>
                      </div>
                      <p className="text-sm font-bold" style={{ color: "#607D8B" }}>{item.title}</p>
                      <p className="text-xs leading-relaxed mt-0.5" style={{ color: "#9AABB8" }}>{item.note}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onStarToggle(item.id)}
                    style={{ fontSize: "1rem", color: starred.has(item.id) ? "#D35400" : "#C8C0A8", background: "none", border: "none", cursor: "pointer", flexShrink: 0, transition: "transform 0.15s", transform: starred.has(item.id) ? "scale(1.2)" : "scale(1)" }}
                  >
                    {starred.has(item.id) ? "★" : "☆"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* コンテンツ */}
      {tab === "content" && (
        <ul className="flex flex-col gap-2">
          {entry.content.map((item: ContentSuggestion) => (
            <li key={item.id}>
              <div
                className="rounded-2xl px-4 py-3"
                style={{
                  backgroundColor: starred.has(item.id) ? "rgba(211,84,0,0.06)" : "rgba(163,177,138,0.08)",
                  border: `1px solid ${starred.has(item.id) ? "rgba(211,84,0,0.28)" : "rgba(163,177,138,0.22)"}`,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="text-base shrink-0">{CONTENT_ICON[item.category]}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-bold rounded-full px-2 py-0.5" style={{ backgroundColor: "#D35400", color: "#FDFCF5" }}>
                          {CONTENT_LABEL[item.category]}
                        </span>
                      </div>
                      <p className="text-sm font-bold" style={{ color: "#607D8B" }}>{item.title}</p>
                      <p className="text-xs leading-relaxed mt-0.5" style={{ color: "#9AABB8" }}>{item.note}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onStarToggle(item.id)}
                    style={{ fontSize: "1rem", color: starred.has(item.id) ? "#D35400" : "#C8C0A8", background: "none", border: "none", cursor: "pointer", transition: "transform 0.15s", transform: starred.has(item.id) ? "scale(1.2)" : "scale(1)" }}
                  >
                    {starred.has(item.id) ? "★" : "☆"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 行動 */}
      {tab === "action" && (
        <ul className="flex flex-col gap-2">
          {entry.action.map((item: ActionSuggestion, i: number) => (
            <li key={item.id}>
              <div
                className="rounded-2xl px-4 py-3"
                style={{
                  backgroundColor: starred.has(item.id) ? "rgba(211,84,0,0.06)" : "rgba(163,177,138,0.08)",
                  border: `1px solid ${starred.has(item.id) ? "rgba(211,84,0,0.28)" : "rgba(163,177,138,0.22)"}`,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="text-xs font-black rounded-xl px-2 py-0.5 shrink-0 mt-0.5" style={{ backgroundColor: "rgba(211,84,0,0.10)", color: "#D35400" }}>
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold" style={{ color: "#607D8B" }}>{item.title}</p>
                      <p className="text-xs leading-relaxed mt-0.5" style={{ color: "#9AABB8" }}>{item.note}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onStarToggle(item.id)}
                    style={{ fontSize: "1rem", color: starred.has(item.id) ? "#D35400" : "#C8C0A8", background: "none", border: "none", cursor: "pointer", transition: "transform 0.15s", transform: starred.has(item.id) ? "scale(1.2)" : "scale(1)" }}
                  >
                    {starred.has(item.id) ? "★" : "☆"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 詳細リンク */}
      <div className="mt-3 flex justify-end">
        <Link
          href={`/result/${entry.id}`}
          className="inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-bold transition-all hover:-translate-y-0.5"
          style={{
            backgroundColor: "rgba(96,125,139,0.10)",
            border: "1px solid rgba(96,125,139,0.25)",
            color: "#607D8B",
          }}
        >
          詳細ページで見る →
        </Link>
      </div>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const [history,    setHistory]    = useState<MoodEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [starred,    setStarred]    = useState<Set<string>>(new Set());

  useEffect(() => {
    setHistory(getHistory());
    setStarred(getStarred());
  }, []);

  const handleDelete = (id: string) => {
    deleteEntry(id);
    setHistory(getHistory());
    if (expandedId === id) setExpandedId(null);
  };

  const handleStarToggle = (itemId: string) => {
    toggleStarred(itemId);
    setStarred(getStarred());
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FDFCF5" }}>
      {/* ── NAV ── */}
      <nav
        className="sticky top-0 z-10"
        style={{
          backgroundColor: "#FDFCF5",
          borderBottom: "1.5px solid rgba(163,177,138,0.25)",
          boxShadow: "0 2px 12px rgba(163,177,138,0.08)",
        }}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="text-2xl sm:text-3xl"
            style={{ fontFamily: "var(--font-pacifico)", color: "#D35400" }}
          >
            mood organ
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold transition-all hover:-translate-y-0.5"
            style={{
              backgroundColor: "rgba(211,84,0,0.08)",
              border: "1.5px solid rgba(211,84,0,0.20)",
              color: "#D35400",
            }}
          >
            ✏️ 今日の出来事を書く
          </Link>
        </div>
      </nav>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: "#607D8B" }}>気分の履歴</h2>
          {history.length > 0 && (
            <span className="text-xs" style={{ color: "#A3B18A" }}>{history.length} 件</span>
          )}
        </div>

        {history.length === 0 ? (
          <div
            className="rounded-3xl px-6 py-16 text-center"
            style={{ border: "1.5px dashed rgba(163,177,138,0.45)", backgroundColor: "rgba(163,177,138,0.06)" }}
          >
            <p className="text-3xl mb-4">🌱</p>
            <p className="text-sm font-bold mb-2" style={{ color: "#607D8B" }}>まだ記録がありません</p>
            <p className="text-xs leading-relaxed" style={{ color: "#A3B18A" }}>
              今日の出来事を書いて、<br />気持ちを切り替えてみましょう。
            </p>
            <Link
              href="/"
              className="inline-flex mt-5 items-center gap-1 rounded-full px-5 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: "#D35400", color: "#FDFCF5", boxShadow: "0 4px 14px rgba(211,84,0,0.28)" }}
            >
              書いてみる →
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {history.map((entry) => {
              const date = new Date(entry.date).toLocaleDateString("ja-JP", {
                year: "numeric", month: "long", day: "numeric", weekday: "short",
              });
              const time = new Date(entry.date).toLocaleTimeString("ja-JP", {
                hour: "2-digit", minute: "2-digit",
              });
              const isOpen = expandedId === entry.id;

              return (
                <li key={entry.id}>
                  <div
                    className="rounded-3xl p-5 transition-all duration-200"
                    style={{
                      backgroundColor: "rgba(163,177,138,0.10)",
                      border: isOpen ? "1.5px solid rgba(163,177,138,0.45)" : "1.5px solid rgba(163,177,138,0.28)",
                      boxShadow: isOpen ? "0 4px 16px rgba(163,177,138,0.14)" : "0 2px 10px rgba(163,177,138,0.08)",
                    }}
                  >
                    {/* ヘッダー（クリックでアコーディオン開閉） */}
                    <button
                      className="w-full text-left"
                      onClick={() => toggleExpand(entry.id)}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-xs font-bold" style={{ color: "#A3B18A" }}>
                          {date}　{time}
                        </p>
                        <span
                          className="text-sm transition-transform duration-200"
                          style={{
                            color: "#A3B18A",
                            display: "inline-block",
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        >
                          ▾
                        </span>
                      </div>

                      <p className="text-sm leading-relaxed line-clamp-2 mb-2" style={{ color: "#607D8B" }}>
                        {entry.text}
                      </p>

                      <p
                        className="text-xs leading-relaxed px-3 py-2 rounded-2xl"
                        style={{
                          backgroundColor: "rgba(211,84,0,0.06)",
                          color: "#D35400",
                          border: "1px solid rgba(211,84,0,0.12)",
                        }}
                      >
                        🌡️ {entry.mood}
                      </p>
                    </button>

                    {/* アコーディオン本体 */}
                    {isOpen && (
                      <AccordionBody
                        entry={entry}
                        starred={starred}
                        onStarToggle={handleStarToggle}
                      />
                    )}

                    {/* フッター */}
                    {!isOpen && (
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex gap-2 flex-wrap">
                          {[
                            { icon: "🍽️", label: "食事", count: entry.food.length },
                            { icon: "🎬", label: "コンテンツ", count: entry.content.length },
                            { icon: "🚶", label: "行動", count: entry.action.length },
                          ].map(({ icon, label, count }) => (
                            <span key={label} className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs" style={{ backgroundColor: "rgba(163,177,138,0.15)", color: "#607D8B" }}>
                              {icon} {label} {count}件
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-xs rounded-full px-3 py-1 transition-all hover:opacity-70"
                          style={{ backgroundColor: "rgba(211,84,0,0.08)", color: "#D35400", border: "1px solid rgba(211,84,0,0.15)" }}
                        >
                          削除
                        </button>
                      </div>
                    )}

                    {isOpen && (
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-xs rounded-full px-3 py-1 transition-all hover:opacity-70"
                          style={{ backgroundColor: "rgba(211,84,0,0.08)", color: "#D35400", border: "1px solid rgba(211,84,0,0.15)" }}
                        >
                          削除
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
