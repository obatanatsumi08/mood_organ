"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { shuffle, MOCK_MOODS, MOCK_FOOD, MOCK_CONTENT, MOCK_ACTION } from "@/lib/mock";
import { saveEntry } from "@/lib/storage";
import type { MoodEntry } from "@/lib/types";

export default function Home() {
  const router = useRouter();
  const [moodText, setMoodText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const canSubmit = useMemo(
    () => moodText.trim().length > 0 && !isSubmitting,
    [moodText, isSubmitting]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;
      setIsSubmitting(true);

      window.setTimeout(() => {
        const entry: MoodEntry = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          text: moodText.trim(),
          mood: shuffle(MOCK_MOODS)[0],
          food: shuffle(MOCK_FOOD).slice(0, 3),
          content: shuffle(MOCK_CONTENT).slice(0, 4),
          action: shuffle(MOCK_ACTION).slice(0, 3),
        };
        saveEntry(entry);
        router.push(`/result/${entry.id}`);
      }, 650);
    },
    [canSubmit, moodText, router]
  );

  return (
    <div className="min-h-full flex flex-col" style={{ backgroundColor: "#FDFCF5" }}>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-4 py-12 sm:px-6 sm:py-16">

        {/* ── HEADER ── */}
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1
              className="text-4xl sm:text-5xl"
              style={{ fontFamily: "var(--font-pacifico)", color: "#D35400" }}
            >
              mood organ
            </h1>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: "#A3B18A" }}>
              今日の出来事を教えてください。食事・コンテンツ・行動の3つの視点からあなたのムード（情調）を切り替えるお手伝いをします。
            </p>
          </div>
          <Link
            href="/history"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5"
            style={{
              backgroundColor: "rgba(163,177,138,0.15)",
              border: "1.5px solid rgba(163,177,138,0.35)",
              color: "#607D8B",
            }}
          >
            📋 履歴を見る
          </Link>
        </header>

        {/* ── INPUT FORM ── */}
        <section
          className="rounded-3xl p-6"
          style={{
            backgroundColor: "#FDFCF5",
            boxShadow: "0 4px 24px rgba(163,177,138,0.14)",
            border: "1.5px solid rgba(163,177,138,0.35)",
          }}
        >
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label htmlFor="mood" className="block text-sm font-bold" style={{ color: "#607D8B" }}>
              今日の出来事
            </label>
            <textarea
              id="mood"
              name="mood"
              rows={6}
              value={moodText}
              onChange={(e) => setMoodText(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="例：朝から会議が続いて疲れた。帰り道の空がきれいで少し救われた。"
              className="w-full resize-y rounded-3xl px-5 py-4 text-sm leading-relaxed outline-none transition-all duration-200"
              style={{
                backgroundColor: focused ? "rgba(163,177,138,0.20)" : "rgba(163,177,138,0.12)",
                border: `1.5px solid ${focused ? "#A3B18A" : "rgba(163,177,138,0.40)"}`,
                color: "#607D8B",
                boxShadow: focused
                  ? "inset 0 2px 10px rgba(163,177,138,0.20), 0 0 0 3px rgba(163,177,138,0.12)"
                  : "inset 0 2px 8px rgba(163,177,138,0.12)",
              }}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs" style={{ color: "#A3B18A" }}>
                {moodText.trim().length === 0 ? "ひとことでも大丈夫です。" : `${moodText.trim().length} 文字`}
              </p>
              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex h-11 items-center justify-center rounded-full px-8 text-sm font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  backgroundColor: canSubmit ? (btnHover ? "#E8651A" : "#D35400") : "rgba(163,177,138,0.30)",
                  color: canSubmit ? "#FDFCF5" : "#A3B18A",
                  boxShadow: canSubmit
                    ? btnHover ? "0 6px 20px rgba(211,84,0,0.40)" : "0 4px 16px rgba(211,84,0,0.28)"
                    : "none",
                  transform: btnHover && canSubmit ? "translateY(-2px)" : "translateY(0)",
                }}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
              >
                {isSubmitting ? "考え中…" : "気持ちを切り替える →"}
              </button>
            </div>
          </form>
        </section>

        {isSubmitting && (
          <div className="text-center py-8">
            <div className="flex justify-center gap-2 mb-4">
              {["#A3B18A", "#D35400", "#607D8B", "#A3B18A", "#D35400"].map((color, i) => (
                <span
                  key={i}
                  className="inline-block rounded-full animate-bounce"
                  style={{ width: 10, height: 10, backgroundColor: color, animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
            <p className="text-sm" style={{ color: "#A3B18A" }}>あなたに合った解決策を探しています…</p>
          </div>
        )}
      </main>
    </div>
  );
}
