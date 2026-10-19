export interface WeddingPhoto {
  src: string;
  alt: string;
  caption: string;
  position?: string;
}
export interface WeddingVenue {
  name: string;
  time: string | null;
  mapsUrl: string | null;
}
