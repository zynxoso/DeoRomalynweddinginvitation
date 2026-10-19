import Image from "next/image";
export function Botanical({ className = "" }: { className?: string }) {
  return <div className={`botanical ${className}`} aria-hidden="true"><Image src="/decorations/botanical.webp" alt="" width={680} height={1020} sizes="(max-width: 768px) 200px, 400px" /></div>;
}
