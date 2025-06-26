export type ClearRecord = {
  id: number;
  nickname: string | null;
  time_in_seconds: number;
  difficulty: "easy" | "medium" | "hard";
  created_at: string;
};
