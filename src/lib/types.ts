export type ContentCategory = "movie" | "manga" | "drama" | "book" | "music";
export type FoodCategory = "meal" | "sweet" | "drink";

export type ContentSuggestion = {
  id: string;
  kind: "content";
  category: ContentCategory;
  title: string;
  note: string;
  recommend: string;
};

export type FoodSuggestion = {
  id: string;
  kind: "food";
  category: FoodCategory;
  title: string;
  note: string;
  recommend: string;
};

export type ActionSuggestion = {
  id: string;
  kind: "action";
  title: string;
  note: string;
  recommend: string;
};

export type MoodEntry = {
  id: string;
  date: string;
  text: string;
  mood: string;
  food: FoodSuggestion[];
  content: ContentSuggestion[];
  action: ActionSuggestion[];
};
