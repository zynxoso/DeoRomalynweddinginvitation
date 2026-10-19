import { wedding } from "@/config/wedding";
const escape = (value: string) => value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
export function GET() {
  const date = wedding.date.replaceAll("-", "");
  const end = new Date(`${wedding.date}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 1);
  const endDate = end.toISOString().slice(0, 10).replaceAll("-", "");
  const content = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Deo and Romalyn//Wedding Invitation//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT", `UID:deo-romalyn-${date}@wedding-invitation`, "DTSTAMP:20261019T000000Z", `DTSTART;VALUE=DATE:${date}`, `DTEND;VALUE=DATE:${endDate}`, `SUMMARY:${escape(`${wedding.names.first} & ${wedding.names.second}'s wedding`)}`, `LOCATION:${escape(wedding.ceremony.name)}`, `DESCRIPTION:${escape(`Save the date. Ceremony: ${wedding.ceremony.name}. Reception: ${wedding.reception.name}. Event times and exact directions to be announced. Philippines (${wedding.timezone}).`)}`, "TRANSP:TRANSPARENT", "END:VEVENT", "END:VCALENDAR", ""].join("\r\n");
  return new Response(content, { headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": 'attachment; filename="deo-and-romalyn.ics"' } });
}
