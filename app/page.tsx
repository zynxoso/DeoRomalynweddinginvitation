import Image from "next/image";
import { ArrowUpRight, CalendarDays, Clock3, Flower2, MapPin, Wine } from "lucide-react";
import { wedding } from "@/config/wedding";
import { InvitationShell } from "@/components/invitation-shell";
import { Reveal } from "@/components/animations/reveal";
import { Botanical } from "@/components/botanical";
import { Countdown } from "@/components/countdown";
import { Gallery } from "@/components/gallery";
import { RsvpForm } from "@/components/rsvp-form";

export default function Home() {
  return <InvitationShell><main id="main">
    <section id="home" className="hero">
      <div className="hero-backdrop"><Image src={wedding.photos.hero.src} alt={wedding.photos.hero.alt} fill loading="eager" fetchPriority="high" quality={95} sizes="(max-width: 760px) 173vw, (max-width: 1050px) 150vw, 100vw" /></div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-copy section-container">
        <div className="hero-heading"><p className="eyebrow">A day for love. A lifetime together.</p><h1 id="couple-names" tabIndex={-1}>{wedding.names.first}<span className="name-second"><i>&</i> {wedding.names.second}</span></h1></div>
        <div className="hero-details"><p className="hero-message">{wedding.welcome}</p><div className="hero-date"><span>{wedding.dayLabel}</span><strong>{wedding.dateLabel}</strong></div><a className="text-link" href="#the-day">Discover the day <ArrowUpRight size={16} /></a></div>
      </div>
    </section>

    <section className="save-date" aria-labelledby="date-title"><Reveal className="section-container date-layout"><div className="date-invitation"><Flower2 size={30} strokeWidth={1} /><h2 id="date-title">Keep this day<br /><em>close to your heart.</em></h2><a className="text-link" href="/calendar" download="deo-and-romalyn.ics"><CalendarDays size={16} /> Save to calendar <ArrowUpRight size={15} /></a></div><div className="date-countdown"><p className="date-numerals">{wedding.dateNumerals[0]} <span>/</span> {wedding.dateNumerals[1]} <span>/</span> {wedding.dateNumerals[2]}</p><Countdown /></div></Reveal></section>

    <section id="our-moments" className="moments section-container section-space"><Reveal><div className="section-heading"><p className="eyebrow">Our favorite place is together</p><h2>A little glimpse <em>of us.</em></h2><p>{wedding.story}</p></div></Reveal><Reveal delay={0.1}><Gallery /></Reveal></section>

    <section id="the-day" className="the-day section-space"><div className="section-container"><Reveal><div className="section-heading"><h2>One day. <em>So much love.</em></h2><p>{wedding.dayLabel}, {wedding.dateLabel}</p></div></Reveal><div className="venue-layout"><Reveal className="venue-card ceremony"><div className="venue-icon"><Flower2 size={33} strokeWidth={1} /></div><p className="venue-type">The ceremony</p><h3>{wedding.ceremony.name}</h3><p>Join us as we say &ldquo;I do.&rdquo;</p><div className="venue-time"><Clock3 size={15} />{wedding.ceremony.time ?? "Time to be announced"}</div>{wedding.ceremony.mapsUrl ? <a className="text-link" href={wedding.ceremony.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={15} /> Get directions <ArrowUpRight size={15} /></a> : <p className="venue-directions"><MapPin size={15} /> Exact directions will be shared soon.</p>}<Botanical className="venue-flower" /></Reveal><div className="venue-connector" aria-hidden="true">&</div><Reveal className="venue-card reception" delay={0.12}><div className="venue-icon"><Wine size={33} strokeWidth={1} /></div><p className="venue-type">The reception</p><h3>{wedding.reception.name}</h3><p>A celebration with our favorite people.</p><div className="venue-time"><Clock3 size={15} />{wedding.reception.time ?? "Time to be announced"}</div>{wedding.reception.mapsUrl ? <a className="text-link" href={wedding.reception.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={15} /> Get directions <ArrowUpRight size={15} /></a> : <p className="venue-directions"><MapPin size={15} /> Exact directions will be shared soon.</p>}</Reveal></div><p className="venue-note">We&apos;ll share the schedule here once the details are settled.</p></div></section>

    <section id="dress-code" className="dress-code section-container section-space"><Reveal className="dress-layout"><div className="dress-illustration"><Botanical /><span>Soft shades,<br /><em>lovely company.</em></span></div><div className="dress-copy"><p className="eyebrow">A pastel garden celebration</p><h2>Come dressed<br /><em>in a little romance.</em></h2><p>{wedding.dressCode} Think flowing fabrics, light suits, and colors that feel at home in a garden.</p><div className="swatches">{wedding.palette.map(color => <div key={color.name}><span style={{ backgroundColor: color.hex }} /><small>{color.name}</small></div>)}</div><p className="dress-note">Choose a shade you love and something you feel good in.</p></div></Reveal></section>

    <section id="rsvp" className="rsvp-section section-space"><div className="section-container rsvp-layout"><Reveal className="rsvp-copy"><span className="rsvp-script">Will you join us?</span><h2>A place in our day.<br /><em>A place in our hearts.</em></h2><p>We would love to celebrate with you. Online RSVP will open here once the invitation details are ready.</p><p className="rsvp-contact">For now, please contact us directly to let us know if you can make it.</p><div className="rsvp-signature">{wedding.names.first} <i>&</i> {wedding.names.second}</div><Botanical className="rsvp-flower" /></Reveal><Reveal delay={0.1}><RsvpForm /></Reveal></div></section>

    <section className="closing section-container section-space"><Reveal className="closing-photo"><Image src={wedding.photos.closing.src} alt={wedding.photos.closing.alt} fill quality={95} sizes="(max-width: 760px) 100vw, 70vw" /></Reveal><Reveal className="closing-copy"><Flower2 size={28} strokeWidth={1} /><h2>We can&apos;t wait<br /><em>to see you.</em></h2><p>{wedding.closing}</p><span className="closing-names">{wedding.names.first} & {wedding.names.second}</span><span className="closing-date">{wedding.dateLabel}</span></Reveal></section>
  </main></InvitationShell>;
}
