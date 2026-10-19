import { NextResponse } from "next/server";

// Fail closed until persistent storage, invitation limits and distributed rate
// limiting are implemented. Never acknowledge a response that was not saved.
export async function POST() {
  return NextResponse.json({ error: "RSVP is in preview mode. Your response has not been sent. Please contact the couple to confirm your attendance." }, { status: 503, headers: { "Cache-Control": "no-store" } });
}
