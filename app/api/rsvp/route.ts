import { handleRsvp } from "@/lib/rsvp-delivery";

export const runtime = "nodejs";
export const maxDuration = 30;
export async function POST(request: Request) { return handleRsvp(request); }
