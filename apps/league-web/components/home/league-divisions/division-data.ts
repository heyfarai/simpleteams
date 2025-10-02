import { Trophy, Users2, CalendarDays } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type TabId = "tab-1" | "tab-2" | "tab-3" | "tab-4";

export interface Division {
  id: TabId;
  name: string;
  displayName: string;
  icon: LucideIcon;
  categories: string[];
  videoSrc: string;
  isNew?: boolean;
}

export const divisions: Division[] = [
  {
    id: "tab-1",
    name: "Diamond  ",
    displayName: "Diamond",
    icon: Trophy,
    categories: ["U19/Mens", "Grade 12 AAA+", "Senior Prep", "CEGEP D1"],
    videoSrc: "/clips/clip1.mp4",
  },
  {
    id: "tab-2",
    name: "Premier",
    displayName: "Premier",
    icon: Users2,
    categories: [
      "U17-U18",
      "Grade 11",
      "Grade 12 AA",
      "Junior Prep",
      "CEGEP D2",
    ],
    videoSrc: "/clips/clip2.mp4",
  },
  {
    id: "tab-3",
    name: "Supreme",
    displayName: "Supreme",
    icon: CalendarDays,
    categories: ["U16 AAA", "Grade 10+", "Junior Prep", "Juvenile Gars"],
    videoSrc: "/clips/clip3.mp4",
  },
  {
    id: "tab-4",
    name: "Ascent",
    displayName: "Ascent",
    icon: CalendarDays,
    categories: ["U15 AAA", "U16 AA", "Grade 9+", "Cadet Gars"],
    videoSrc: "/clips/clip4.mp4",
    isNew: true,
  },
];

export const clips = [
  {
    id: "tab-1",
    image: "/clips/clip-1.mp4",
    alt: "Game action shot",
  },
  {
    id: "tab-2",
    image: "/clips/clip-2.mp4",
    alt: "Player action shot",
  },
  {
    id: "tab-3",
    image: "/clips/clip-3.mp4",
    alt: "Player portrait",
  },
  {
    id: "tab-4",
    image: "/clips/clip-4.mp4",
    alt: "Player portrait",
  },
];
