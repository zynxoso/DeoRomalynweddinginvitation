import type { WeddingPhoto, WeddingVenue } from "@/types/wedding";

// All guest-facing event details live here. Keep unconfirmed details null.
const date = "2026-12-23";
const timezone = "Asia/Manila";
const dateValue = new Date(`${date}T12:00:00+08:00`);
export const wedding = {
  names: { first: "Deo", second: "Romalyn" },
  date,
  timezone,
  countdownTo: `${date}T00:00:00+08:00`,
  dateLabel: new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: timezone }).format(dateValue),
  dayLabel: new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: timezone }).format(dateValue),
  headerDate: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: timezone }).format(dateValue).toUpperCase(),
  dateNumerals: [date.slice(5, 7), date.slice(8, 10), date.slice(2, 4)],
  ceremony: { name: "Luntian Garden", time: null, mapsUrl: null } as WeddingVenue,
  reception: { name: "Luntian Osias Farm and Resort Function Hall", time: null, mapsUrl: null } as WeddingVenue,
  welcome: "Together with our families, we invite you to celebrate our wedding.",
  story: "A few of our favorite moments, and a new one to look forward to with you.",
  closing: "The day will be all the more special with you there. Thank you for being part of our lives and this next chapter.",
  dressCode: "Formal or semi-formal attire in soft pastel colors.",
  rsvp: { mode: "preview" as const, deadline: null, allowedGuests: null as number | null },
  photos: {
    hero: { src: "/images/hero.webp", alt: "Romalyn leaning on Deo as he kisses her forehead, seated together in the garden.", caption: "Together, always." },
    gallery: [
      { src: "/images/garden-walk.webp", alt: "Deo bowing to kiss Romalyn's hand on a garden stairway in matching blush outfits.", caption: "Hand in hand." },
      { src: "/images/laughter.webp", alt: "Deo and Romalyn laughing together on a garden bench in white outfits.", caption: "The little moments." },
      { src: "/images/pink-portrait.webp", alt: "Romalyn resting her head on Deo's shoulder with a bouquet of pink roses.", caption: "Right here with you." },
      { src: "/images/forest.webp", alt: "Deo and Romalyn sitting back to back on a sunlit forest lawn.", caption: "Our kind of afternoon." },
      { src: "/images/blue.webp", alt: "Deo and Romalyn touching foreheads among the pine trees in powder blue outfits.", caption: "A moment for us." }
    ] satisfies WeddingPhoto[],
    closing: { src: "/images/together.webp", alt: "Deo and Romalyn sharing a kiss in a clearing surrounded by pine trees.", caption: "A new chapter." }
  },
  palette: [
    { name: "Sage", hex: "#A8BBA3" }, { name: "Blush", hex: "#F4D6D6" },
    { name: "Dusty rose", hex: "#D9A5AD" }, { name: "Lavender", hex: "#DCD3EB" },
    { name: "Peach", hex: "#F8DFCC" }, { name: "Powder blue", hex: "#CFDFE8" },
    { name: "Champagne", hex: "#EBDDCA" }
  ]
};
