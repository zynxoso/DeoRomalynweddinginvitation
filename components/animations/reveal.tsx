"use client";
import { motion, useReducedMotion } from "motion/react";
export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
