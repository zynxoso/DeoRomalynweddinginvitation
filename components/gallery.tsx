"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import { wedding } from "@/config/wedding";
export function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const photos = wedding.photos.gallery;
  useEffect(() => {
    if (selected === null) return;
    if (!dialog.current?.open) dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [selected]);
  function close() { const previous = selected; dialog.current?.close(); setSelected(null); if (previous !== null) triggers.current[previous]?.focus(); }
  function next(step: number) { setSelected(current => current === null ? 0 : (current + step + photos.length) % photos.length); }
  return <><div className="gallery-grid">{photos.map((photo, i) => <figure key={photo.src} className={`gallery-item gallery-item-${i + 1}`}><button ref={el => { triggers.current[i] = el; }} onClick={() => setSelected(i)} aria-label={`Enlarge photo: ${photo.alt}`}><Image src={photo.src} alt={photo.alt} fill sizes={i < 2 ? "(max-width: 600px) 90vw, 50vw" : "(max-width: 600px) 90vw, 33vw"} /><span className="photo-plus"><Plus size={19} /></span></button><figcaption>{photo.caption}</figcaption></figure>)}</div>
    <dialog ref={dialog} className="lightbox" aria-label="Couple photographs" onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === e.currentTarget) close(); }} onKeyDown={e => { if (e.key === "ArrowRight") next(1); if (e.key === "ArrowLeft") next(-1); }}>
      {selected !== null && <><button className="lightbox-close icon-button" aria-label="Close photo viewer" onClick={close}><X /></button><div className="lightbox-image"><Image src={photos[selected].src} alt={photos[selected].alt} fill sizes="90vw" style={{ objectFit: "contain" }} /></div><div className="lightbox-controls"><button className="icon-button" aria-label="Previous photo" onClick={() => next(-1)}><ArrowLeft /></button><p aria-live="polite">{photos[selected].caption}<span>{selected + 1} / {photos.length}</span></p><button className="icon-button" aria-label="Next photo" onClick={() => next(1)}><ArrowRight /></button></div></>}
    </dialog></>;
}
