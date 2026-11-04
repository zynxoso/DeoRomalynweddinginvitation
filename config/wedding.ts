import { galleryPhotos } from "./gallery";
import type { WeddingVenue } from "@/types/wedding";

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
  reception: {
    name: "Luntiang Oasis Farm and Resort",
    time: null,
    mapsUrl: "https://maps.app.goo.gl/2NfUvH8hsxkbM18s8",
    mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3841.6369686490752!2d120.73993081175439!3d15.664308584895295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33912d63ac99c8a9%3A0xed62f2ed60bafbc5!2sLuntiang%20Oasis%20Farm%20and%20Resort!5e0!3m2!1sen!2sph!4v1793773220400!5m2!1sen!2sph"
  } satisfies WeddingVenue,
  welcome: "Together with our families, we invite you to celebrate our wedding.",
  story: "A few of our favorite moments, and a new one to look forward to with you.",
  closing: "The day will be all the more special with you there. Thank you for being part of our lives and this next chapter.",
  dressCode: "Formal or semi-formal attire in soft pastel colors.",
  rsvp: { mode: "preview" as const, deadline: null, allowedGuests: null as number | null },
  photos: {
    hero: { src: "/images/high-resolution/hero-v2.webp", alt: "Romalyn leaning on Deo as he kisses her forehead on a garden bench.", caption: "Together, always." },
    gallery: galleryPhotos,
    closing: { src: "/images/high-resolution/together-v2.webp", alt: "Deo and Romalyn sharing a kiss in a clearing surrounded by pine trees.", caption: "A new chapter." }
  },
  palette: [
    { name: "Blush pink", hex: "#F8CECF" }, { name: "Soft peach", hex: "#F7D9BF" },
    { name: "Butter yellow", hex: "#FDEDA2" }, { name: "Lavender", hex: "#DBCEE8" },
    { name: "Sky blue", hex: "#BCDFF6" }, { name: "Mint cream", hex: "#CEDDBE" }
  ]
};
