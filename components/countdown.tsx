"use client";
import { useEffect, useState } from "react";
import { getCountdown } from "@/lib/countdown";
import { wedding } from "@/config/wedding";
export function Countdown() {
  const [count, setCount] = useState<ReturnType<typeof getCountdown> | null>(null);
  useEffect(() => { const update = () => setCount(getCountdown(wedding.countdownTo, Date.now())); update(); const timer = setInterval(update, 1000); return () => clearInterval(timer); }, []);
  return <div className="countdown-wrap">{count?.complete ? <p className="wedding-day-message">{new Date().toLocaleDateString("en-CA", { timeZone: wedding.timezone }) === wedding.date ? "Today is our day!" : "Forever started here."}</p> : <div className="countdown" aria-label="Countdown to the wedding date in Philippine time">{(["days", "hours", "minutes", "seconds"] as const).map(unit => <div key={unit}><span>{count ? String(count[unit]).padStart(2, "0") : "··"}</span><small>{unit}</small></div>)}</div>}<p className="fine-print">Counting down to our wedding date, Philippine time.</p></div>;
}
