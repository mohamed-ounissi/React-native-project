export type TvShowItem = {
  id: string;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime: number | null;
  premiered: string | null;
  ended: string | null;
  officialSite: string | null;
  ratingAverage: number | null;
  networkName: string | null;
  imageMedium: string | null;
  imageOriginal: string | null;
  summary: string;
};

export const MOCK_ITEMS: TvShowItem[] = [
  {
    id: "1",
    name: "Under the Dome",
    type: "Scripted",
    language: "English",
    genres: ["Drama", "Science-Fiction", "Thriller"],
    status: "Ended",
    runtime: 60,
    premiered: "2013-06-24",
    ended: "2015-09-10",
    officialSite: "http://www.cbs.com/shows/under-the-dome/",
    ratingAverage: 6.6,
    networkName: "CBS",
    imageMedium: null,
    imageOriginal: null,
    summary:
      "A small town is suddenly sealed off from the outside world by a mysterious transparent dome. The residents struggle to survive while searching for answers.",
  },
  {
    id: "2",
    name: "Person of Interest",
    type: "Scripted",
    language: "English",
    genres: ["Action", "Crime", "Science-Fiction"],
    status: "Ended",
    runtime: 60,
    premiered: "2011-09-22",
    ended: "2016-06-21",
    officialSite: "http://www.cbs.com/shows/person_of_interest/",
    ratingAverage: 8.8,
    networkName: "CBS",
    imageMedium:
      null,
    imageOriginal:
      null,
    summary:
      "An ex-CIA agent and a mysterious billionaire use a surveillance system to prevent violent crimes before they happen.",
  },
  {
    id: "4",
    name: "Arrow",
    type: "Scripted",
    language: "English",
    genres: ["Drama", "Action", "Science-Fiction"],
    status: "Ended",
    runtime: 60,
    premiered: "2012-10-10",
    ended: "2020-01-28",
    officialSite: null,
    ratingAverage: 7.4,
    networkName: "The CW",
    imageMedium:
      null,
    imageOriginal:
      null,
    summary:
      "After years away, billionaire Oliver Queen returns home and secretly becomes a vigilante to fight corruption and crime.",
  },
  {
    id: "5",
    name: "True Detective",
    type: "Scripted",
    language: "English",
    genres: ["Drama", "Crime", "Thriller"],
    status: "Running",
    runtime: 60,
    premiered: "2014-01-12",
    ended: null,
    officialSite:
      "https://www.max.com/shows/true-detective/9a4a3645-74e0-4e4d-9f35-31464b402357",
    ratingAverage: 8.1,
    networkName: "HBO",
    imageMedium:
      null,
    imageOriginal:
      null,
    summary:
      "An anthology crime series where each season follows a new investigation and the detectives drawn into it.",
  },
];
