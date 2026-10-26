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
    hero: { src: "/images/high-resolution/forest-wedding-v2.webp", alt: "Deo and Romalyn holding hands and looking at each other among the pine trees, dressed in white.", caption: "Together, always." },
    gallery: [
      { src: "/images/high-resolution/garden-walk-v2.webp", alt: "Deo bowing to kiss Romalyn's hand on a garden stairway in matching blush outfits.", caption: "Hand in hand." },
      { src: "/images/high-resolution/laughter-v2.webp", alt: "Deo and Romalyn laughing together on a garden bench in white outfits.", caption: "The little moments." },
      { src: "/images/high-resolution/pink-portrait-v2.webp", alt: "Romalyn resting her head on Deo's shoulder with a bouquet of pink roses.", caption: "Right here with you." },
      { src: "/images/high-resolution/forest-v2.webp", alt: "Deo and Romalyn sitting back to back on a sunlit forest lawn.", caption: "Our kind of afternoon." },
      { src: "/images/high-resolution/blue-v2.webp", alt: "Deo and Romalyn touching foreheads among the pine trees in powder blue outfits.", caption: "A moment for us." },
      { src: "/images/high-resolution/hero-v2.webp", alt: "Romalyn leaning on Deo as he kisses her forehead on a garden bench.", caption: "It was always you." },
      { src: "/images/high-resolution/ring-detail.webp", alt: "A close view of Romalyn's ring as her hand rests on Deo's shoulder.", caption: "A promise to keep." },
      { src: "/images/high-resolution/veil-v2.webp", alt: "Romalyn laughing beside Deo as her veil lifts in the air among the pine trees.", caption: "You make me smile." },
      { src: "/images/high-resolution/pink-embrace-v2.webp", alt: "Deo and Romalyn holding each other beside a tree in matching pink outfits.", caption: "Close to you." },
      { src: "/images/high-resolution/pink-garden.webp", alt: "Deo and Romalyn holding hands and looking back at the camera beside a bank of pink flowers.", caption: "Among the flowers." },
      { src: "/images/high-resolution/forest-embrace-v2.webp", alt: "Deo embracing Romalyn from behind as she smiles in a sunlit forest.", caption: "My favorite person." },
      { src: "/images/high-resolution/blue-handkiss-v2.webp", alt: "Deo kissing Romalyn's hand beneath the pine trees, both wearing powder blue.", caption: "With all my love." },
      { src: "/images/high-resolution/bamboo-portrait.webp", alt: "Deo and Romalyn looking back at the camera together beneath an arch of bamboo, dressed in pink.", caption: "Just the two of us." },
      { src: "/images/high-resolution/white-bouquet.webp", alt: "Deo and Romalyn looking at each other among the pines as Romalyn holds her bouquet, both dressed in white.", caption: "In full bloom." },
      { src: "/images/high-resolution/pine-bench.webp", alt: "Romalyn sitting on Deo's lap on a wooden bench beneath the pine trees, holding her bouquet.", caption: "A place beside you." }
    ] satisfies WeddingPhoto[],
    closing: { src: "/images/high-resolution/together-v2.webp", alt: "Deo and Romalyn sharing a kiss in a clearing surrounded by pine trees.", caption: "A new chapter." }
  },
  palette: [
    { name: "Blush pink", hex: "#F8CECF" }, { name: "Soft peach", hex: "#F7D9BF" },
    { name: "Butter yellow", hex: "#FDEDA2" }, { name: "Lavender", hex: "#DBCEE8" },
    { name: "Sky blue", hex: "#BCDFF6" }, { name: "Mint cream", hex: "#CEDDBE" }
  ]
};
