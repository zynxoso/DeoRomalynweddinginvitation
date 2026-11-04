import { ArrowUpRight, MapPin } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import type { WeddingVenue } from "@/types/wedding";

export function VenueMap({ venue }: { venue: WeddingVenue }) {
  if (!venue.mapsEmbedUrl || !venue.mapsUrl) return null;

  return <Reveal className="venue-map">
    <div className="venue-map-heading">
      <div>
        <p className="eyebrow"><MapPin size={14} aria-hidden="true" /> Find your way</p>
        <h3>{venue.name}</h3>
        <p className="venue-map-caption">We look forward to celebrating with you here.</p>
      </div>
      <a className="button primary" href={venue.mapsUrl} target="_blank" rel="noopener noreferrer">
        Open in Google Maps <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </div>
    <iframe
      className="venue-map-frame"
      src={venue.mapsEmbedUrl}
      title={`Reception location: ${venue.name}`}
      width="600"
      height="450"
      allowFullScreen
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  </Reveal>;
}
