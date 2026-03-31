export type TvMazeShowResponse = {
  id: number;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime: number | null;
  premiered: string | null;
  ended: string | null;
  officialSite: string | null;
  rating: { average: number | null };
  network: { name: string } | null;
  image: { medium: string | null; original: string | null } | null;
  summary: string | null;
};
