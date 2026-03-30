import type { MoodEntry } from "./types";

const KEY = "mood_organ_history";

export function getHistory(): MoodEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as MoodEntry[];
  } catch {
    return [];
  }
}

export function saveEntry(entry: MoodEntry): void {
  const history = getHistory();
  localStorage.setItem(KEY, JSON.stringify([entry, ...history]));
}

export function getEntry(id: string): MoodEntry | null {
  return getHistory().find((e) => e.id === id) ?? null;
}

export function deleteEntry(id: string): void {
  const history = getHistory().filter((e) => e.id !== id);
  localStorage.setItem(KEY, JSON.stringify(history));
}

// ── Starred items ──────────────────────────────────────────────────────────

const STAR_KEY = "mood_organ_starred";

export function getStarred(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(STAR_KEY) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
}

export function toggleStarred(itemId: string): boolean {
  const starred = getStarred();
  if (starred.has(itemId)) {
    starred.delete(itemId);
  } else {
    starred.add(itemId);
  }
  localStorage.setItem(STAR_KEY, JSON.stringify([...starred]));
  return starred.has(itemId);
}
