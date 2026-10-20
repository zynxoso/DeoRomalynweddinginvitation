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
    hero: { src: "/images/high-resolution/forest-wedding.webp", alt: "Deo and Romalyn holding hands and looking at each other among the pine trees, dressed in white.", caption: "Together, always." },
    gallery: [
      { src: "/images/high-resolution/garden-walk.webp", alt: "Deo bowing to kiss Romalyn's hand on a garden stairway in matching blush outfits.", caption: "Hand in hand." },
      { src: "/images/high-resolution/laughter.webp", alt: "Deo and Romalyn laughing together on a garden bench in white outfits.", caption: "The little moments." },
      { src: "/images/high-resolution/pink-portrait.webp", alt: "Romalyn resting her head on Deo's shoulder with a bouquet of pink roses.", caption: "Right here with you." },
      { src: "/images/high-resolution/forest.webp", alt: "Deo and Romalyn sitting back to back on a sunlit forest lawn.", caption: "Our kind of afternoon." },
      { src: "/images/high-resolution/blue.webp", alt: "Deo and Romalyn touching foreheads among the pine trees in powder blue outfits.", caption: "A moment for us." },
      { src: "/images/high-resolution/hero.webp", alt: "Romalyn leaning on Deo as he kisses her forehead on a garden bench.", caption: "It was always you." },
      { src: "/images/high-resolution/ring-detail.webp", alt: "A close view of Romalyn's ring as her hand rests on Deo's shoulder.", caption: "A promise to keep." },
      { src: "/images/high-resolution/veil.webp", alt: "Romalyn laughing beside Deo as her veil lifts in the air among the pine trees.", caption: "You make me smile." },
      { src: "/images/high-resolution/bamboo-walk.webp", alt: "Deo and Romalyn walking hand in hand along a path surrounded by tall bamboo.", caption: "Wherever we go." },
      { src: "/images/high-resolution/flower-garden.webp", alt: "Deo and Romalyn together on a garden path surrounded by pink flowers.", caption: "Among the flowers." },
      { src: "/images/high-resolution/forest-embrace.webp", alt: "Deo embracing Romalyn from behind as she smiles in a sunlit forest.", caption: "My favorite person." },
      { src: "/images/high-resolution/blue-handkiss.webp", alt: "Deo kissing Romalyn's hand beneath the pine trees, both wearing powder blue.", caption: "With all my love." }
    ] satisfies WeddingPhoto[],
    closing: { src: "/images/high-resolution/together.webp", alt: "Deo and Romalyn sharing a kiss in a clearing surrounded by pine trees.", caption: "A new chapter." }
  },
  palette: [
    { name: "Sage", hex: "#A8BBA3" }, { name: "Blush", hex: "#F4D6D6" },
    { name: "Dusty rose", hex: "#D9A5AD" }, { name: "Lavender", hex: "#DCD3EB" },
    { name: "Peach", hex: "#F8DFCC" }, { name: "Powder blue", hex: "#CFDFE8" },
    { name: "Champagne", hex: "#EBDDCA" }
  ]
};
