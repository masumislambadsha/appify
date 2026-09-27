"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const TAGS = {
  div: motion.div,
  article: motion.article,
  li: motion.li,
} as const;

/**
 * Scroll-reveal island. Lets server-rendered pages keep the landing's
 * fade-up choreography (same variants, stagger via `index`) without forcing
 * `"use client"` on the whole page — only these small subtrees hydrate with
 * motion. Honors `prefers-reduced-motion` via the app-wide MotionConfig.
 */
export function Reveal({
  as = "div",
  index = 0,
  className,
  children,
}: {
  as?: keyof typeof TAGS;
  index?: number;
  className?: string;
  children: ReactNode;
}) {
  const Tag = TAGS[as] as typeof motion.div;
  return (
    <Tag
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      custom={index}
      className={className}
    >
      {children}
    </Tag>
  );
}
