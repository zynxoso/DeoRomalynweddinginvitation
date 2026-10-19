"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Heart, Menu, X } from "lucide-react";
import { Botanical } from "@/components/botanical";
import { wedding } from "@/config/wedding";

const links = [["The day", "#the-day"], ["Our moments", "#our-moments"], ["Dress code", "#dress-code"]];
export function InvitationShell({ children }: { children: React.ReactNode }) {
  const [entrance, setEntrance] = useState(true);
  const [opening, setOpening] = useState(false);
  const [menu, setMenu] = useState(false);
  const reduce = useReducedMotion();
  const openButton = useRef<HTMLButtonElement>(null);
  const skipButton = useRef<HTMLButtonElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!entrance) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    openButton.current?.focus();
    return () => { document.body.style.overflow = previous; };
  }, [entrance]);
  useEffect(() => {
    if (!opening) return;
    const id = setTimeout(() => { setEntrance(false); setOpening(false); }, reduce ? 0 : 1500);
    return () => clearTimeout(id);
  }, [opening, reduce]);
  function replay() { window.scrollTo({ top: 0, behavior: "instant" }); setEntrance(true); setMenu(false); }
  return <>
    <div inert={entrance} className={`guest-view ${entrance ? "" : "is-open"}`}>
      <a href="#main" className="skip-link">Skip to invitation</a>
      <header className="site-header">
        <a href="#home" className="monogram" aria-label="Deo and Romalyn, home">D<span>&</span>R</a>
        <span className="header-date">{wedding.headerDate}</span>
        <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}<a className="nav-rsvp" href="#rsvp">RSVP <ArrowUpRight size={14} /></a></nav>
        <button ref={menuButton} className="menu-button" aria-expanded={menu} aria-controls="mobile-navigation" aria-label={menu ? "Close menu" : "Open menu"} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
        {menu && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" onKeyDown={e => { if (e.key === "Escape") { setMenu(false); menuButton.current?.focus(); } }}>{[...links, ["RSVP", "#rsvp"]].map(([label, href]) => <a key={href} href={href} onClick={() => setMenu(false)}>{label}<ArrowUpRight size={16} /></a>)}</nav>}
      </header>
      {children}
      <footer className="site-footer"><a className="monogram" href="#home" aria-label="Back to the beginning">D<span>&</span>R</a><span>With love, {wedding.names.first} & {wedding.names.second}</span><button onClick={replay}>Open the envelope again <Heart size={13} /></button></footer>
    </div>
    <AnimatePresence onExitComplete={() => document.getElementById("couple-names")?.focus({ preventScroll: true })}>{entrance && <motion.div className="entrance" role="dialog" aria-modal="true" aria-labelledby="entrance-title" initial={false} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.65 }} onKeyDown={e => {
      if (e.key === "Escape" && !opening) setOpening(true);
      if (e.key === "Tab") { e.preventDefault(); if (document.activeElement === openButton.current) skipButton.current?.focus(); else openButton.current?.focus(); }
    }}>
      <Botanical className="entrance-flower-left" /><Botanical className="entrance-flower-right" />
      <div className="entrance-top"><span className="monogram">D<span>&</span>R</span><span>A WEDDING INVITATION</span></div>
      <div className="entrance-content"><p className="eyebrow">For you, with love</p><h1 id="entrance-title">A beautiful day.<br /><em>Our favorite people.</em></h1>
        <div className={`envelope ${opening ? "is-opening" : ""}`} aria-hidden="true"><div className="envelope-letter"><span>Deo & Romalyn</span><small>{wedding.dateLabel}</small></div><div className="envelope-back" /><div className="envelope-front" /><div className="envelope-flap" /><div className="wax-seal">D<span>&</span>R</div></div>
        <button ref={openButton} onClick={() => setOpening(true)} disabled={opening} className="button primary">{opening ? "With love…" : "Open invitation"}<ArrowUpRight size={16} /></button>
        <button ref={skipButton} className="entrance-skip" onClick={() => setEntrance(false)}>View invitation</button>
      </div><p className="entrance-date">{wedding.dayLabel} <span>·</span> {wedding.dateLabel}</p>
      {opening && <div className="petals" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <i key={i} style={{ left: `${15 + i * 12}%`, animationDelay: `${i * 0.07}s` }} />)}</div>}
    </motion.div>}</AnimatePresence>
  </>;
}
