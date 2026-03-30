"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getEntry, getStarred, toggleStarred } from "@/lib/storage";
import type { MoodEntry, FoodSuggestion, ContentSuggestion, ActionSuggestion, FoodCategory, ContentCategory } from "@/lib/types";

type ResultTab = "food" | "content" | "action";

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

const TABS: { key: ResultTab; label: string; icon: string }[] = [
  { key: "food",    label: "食事で解決",      icon: "🍽️" },
  { key: "content", label: "コンテンツで解決", icon: "🎬" },
  { key: "action",  label: "行動で解決",      icon: "🚶" },
];

function cardHover(e: React.MouseEvent<HTMLElement>, enter: boolean) {
  const el = e.currentTarget as HTMLElement;
  el.style.boxShadow = enter ? "0 8px 24px rgba(163,177,138,0.24)" : "0 2px 12px rgba(163,177,138,0.10)";
  el.style.borderColor = enter ? "rgba(163,177,138,0.55)" : "rgba(163,177,138,0.30)";
  el.style.backgroundColor = enter ? "rgba(163,177,138,0.18)" : "rgba(163,177,138,0.12)";
}

function StarButton({ itemId, starred, onToggle }: { itemId: string; starred: boolean; onToggle: (id: string) => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(itemId); }}
      title={starred ? "スター解除" : "やった・見た！"}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "1.1rem",
        lineHeight: 1,
        padding: "2px 4px",
        color: starred ? "#D35400" : "#C8C0A8",
        transition: "transform 0.15s, color 0.15s",
        transform: starred ? "scale(1.2)" : "scale(1)",
      }}
    >
      {starred ? "★" : "☆"}
    </button>
  );
}

function RecommendBox({ text }: { text: string }) {
  return (
    <div
      className="rounded-2xl px-4 py-3 text-xs leading-relaxed mt-3"
      style={{ backgroundColor: "rgba(211,84,0,0.07)", color: "#D35400" }}
    >
      💡 {text}
    </div>
  );
}

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [entry,   setEntry]   = useState<MoodEntry | null>(null);
  const [tab,     setTab]     = useState<ResultTab>("food");
  const [starred, setStarred] = useState<Set<string>>(new Set());

  useEffect(() => {
    const found = getEntry(id);
    if (!found) { router.replace("/"); return; }
    setEntry(found);
    setStarred(getStarred());
  }, [id, router]);

  const handleStar = (itemId: string) => {
    toggleStarred(itemId);
    setStarred(getStarred());
  };

  if (!entry) return null;

  const formattedDate = new Date(entry.date).toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric", weekday: "short",
  });

  return (
    <div className="min-h-full flex flex-col" style={{ backgroundColor: "#FDFCF5" }}>
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
          <div className="flex gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: "rgba(211,84,0,0.08)",
                border: "1.5px solid rgba(211,84,0,0.20)",
                color: "#D35400",
              }}
            >
              ✏️ 新しく入力
            </Link>
            <Link
              href="/history"
              className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: "rgba(163,177,138,0.15)",
                border: "1.5px solid rgba(163,177,138,0.35)",
                color: "#607D8B",
              }}
            >
              📋 履歴
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">

        {/* ── 日付 & 入力内容 ── */}
        <div>
          <p className="text-xs font-bold mb-3" style={{ color: "#A3B18A", letterSpacing: "0.06em" }}>
            {formattedDate}
          </p>
          <div
            className="rounded-3xl px-5 py-4"
            style={{
              backgroundColor: "rgba(163,177,138,0.10)",
              border: "1.5px solid rgba(163,177,138,0.28)",
            }}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#607D8B" }}>
              {entry.text}
            </p>
          </div>
        </div>

        {/* ── 気持ち分析 ── */}
        <div
          className="rounded-3xl px-6 py-5"
          style={{
            backgroundColor: "rgba(211,84,0,0.06)",
            border: "1.5px solid rgba(211,84,0,0.18)",
          }}
        >
          <p className="text-xs font-bold mb-2" style={{ color: "#D35400", letterSpacing: "0.06em" }}>
            🌡️ あなたの今の状態
          </p>
          <p className="text-sm leading-relaxed font-medium" style={{ color: "#607D8B" }}>
            {entry.mood}
          </p>
        </div>

        {/* ── タブ ── */}
        <div
          className="flex rounded-3xl p-1.5 gap-1"
          style={{
            backgroundColor: "rgba(163,177,138,0.12)",
            border: "1.5px solid rgba(163,177,138,0.30)",
          }}
        >
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex-1 rounded-2xl py-2.5 text-xs font-bold transition-all duration-200"
              style={{
                backgroundColor: tab === key ? "#FDFCF5" : "transparent",
                color: tab === key ? "#D35400" : "#A3B18A",
                boxShadow: tab === key ? "0 2px 8px rgba(163,177,138,0.20)" : "none",
              }}
            >
              <span className="mr-1">{icon}</span>{label}
            </button>
          ))}
        </div>

        {/* ── 食事 ── */}
        {tab === "food" && (
          <ul className="grid gap-4 grid-cols-1">
            {entry.food.map((item: FoodSuggestion) => (
              <li key={item.id}>
                <article
                  className="rounded-3xl p-5 transition-all duration-200 hover:-translate-y-1"
                  style={{
                    backgroundColor: starred.has(item.id) ? "rgba(211,84,0,0.07)" : "rgba(163,177,138,0.12)",
                    border: starred.has(item.id) ? "1.5px solid rgba(211,84,0,0.35)" : "1.5px solid rgba(163,177,138,0.30)",
                    boxShadow: "0 2px 12px rgba(163,177,138,0.10)",
                  }}
                  onMouseEnter={(e) => cardHover(e, true)}
                  onMouseLeave={(e) => cardHover(e, false)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl" style={{ backgroundColor: "rgba(211,84,0,0.10)" }}>
                      {FOOD_ICON[item.category]}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full px-3 py-0.5 text-xs font-bold" style={{ backgroundColor: "#D35400", color: "#FDFCF5" }}>
                          {FOOD_LABEL[item.category]}
                        </span>
                        <StarButton itemId={item.id} starred={starred.has(item.id)} onToggle={handleStar} />
                      </div>
                      <h3 className="text-base font-bold leading-snug" style={{ color: "#607D8B" }}>{item.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "#7A9BA8" }}>{item.note}</p>
                    </div>
                  </div>
                  <RecommendBox text={item.recommend} />
                </article>
              </li>
            ))}
          </ul>
        )}

        {/* ── コンテンツ ── */}
        {tab === "content" && (
          <ul className="grid gap-4 grid-cols-1">
            {entry.content.map((item: ContentSuggestion) => (
              <li key={item.id}>
                <article
                  className="rounded-3xl p-5 transition-all duration-200 hover:-translate-y-1"
                  style={{
                    backgroundColor: starred.has(item.id) ? "rgba(211,84,0,0.07)" : "rgba(163,177,138,0.12)",
                    border: starred.has(item.id) ? "1.5px solid rgba(211,84,0,0.35)" : "1.5px solid rgba(163,177,138,0.30)",
                    boxShadow: "0 2px 12px rgba(163,177,138,0.10)",
                  }}
                  onMouseEnter={(e) => cardHover(e, true)}
                  onMouseLeave={(e) => cardHover(e, false)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl" style={{ backgroundColor: "rgba(211,84,0,0.10)" }}>
                      {CONTENT_ICON[item.category]}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full px-3 py-0.5 text-xs font-bold" style={{ backgroundColor: "#D35400", color: "#FDFCF5" }}>
                          {CONTENT_LABEL[item.category]}
                        </span>
                        <StarButton itemId={item.id} starred={starred.has(item.id)} onToggle={handleStar} />
                      </div>
                      <h3 className="text-base font-bold leading-snug" style={{ color: "#607D8B" }}>{item.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "#7A9BA8" }}>{item.note}</p>
                    </div>
                  </div>
                  <RecommendBox text={item.recommend} />
                </article>
              </li>
            ))}
          </ul>
        )}

        {/* ── 行動 ── */}
        {tab === "action" && (
          <ul className="grid gap-4">
            {entry.action.map((item: ActionSuggestion, i: number) => (
              <li key={item.id}>
                <article
                  className="rounded-3xl p-5 transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: starred.has(item.id) ? "rgba(211,84,0,0.07)" : "rgba(163,177,138,0.12)",
                    border: starred.has(item.id) ? "1.5px solid rgba(211,84,0,0.35)" : "1.5px solid rgba(163,177,138,0.30)",
                    boxShadow: "0 2px 12px rgba(163,177,138,0.10)",
                  }}
                  onMouseEnter={(e) => cardHover(e, true)}
                  onMouseLeave={(e) => cardHover(e, false)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black" style={{ backgroundColor: "rgba(211,84,0,0.10)", color: "#D35400" }}>
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-bold leading-snug" style={{ color: "#607D8B" }}>{item.title}</h3>
                        <StarButton itemId={item.id} starred={starred.has(item.id)} onToggle={handleStar} />
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "#7A9BA8" }}>{item.note}</p>
                    </div>
                  </div>
                  <RecommendBox text={item.recommend} />
                </article>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
