"use client";

import { buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";

export interface PricingPlan {
  name: string;
  /** Monthly rate in USD, billed monthly. */
  price: string;
  /** Monthly-equivalent rate in USD, billed annually. */
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

interface PricingProps {
  plans?: PricingPlan[];
  title?: string;
  description?: string;
}

/** Brand confetti — plain hex (the source used hsl(var()) channels we don't have). */
const CONFETTI_COLORS = ["#4F5B2A", "#B8892D", "#D8C9A8", "#F5EFE3"];

export const ECHO_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    price: "0",
    yearlyPrice: "0",
    period: "per month",
    features: [
      "Compare 3 models side by side",
      "50 prompts / day",
      "Extension sidebar",
      "Local history",
    ],
    description: "For trying everything once",
    buttonText: "Start free",
    href: "/app",
    isPopular: false,
  },
  {
    name: "Pro",
    price: "12",
    yearlyPrice: "9",
    period: "per month",
    features: [
      "All 6 models + priority",
      "Unlimited prompts",
      "PDF & PPT power tools",
      "Web fetch + enhancer",
    ],
    description: "For daily deep work",
    buttonText: "Go Pro",
    href: "/app",
    isPopular: true,
  },
  {
    name: "Team",
    price: "29",
    yearlyPrice: "23",
    period: "per month",
    features: [
      "Shared workspaces",
      "Prompt library",
      "Admin + SSO (concept)",
      "Priority support",
    ],
    description: "For teams shipping together",
    buttonText: "Talk to us",
    href: "/extension",
    isPopular: false,
  },
];

export function Pricing({
  plans = ECHO_PLANS,
  title = "Start free, upgrade for depth",
  description = "Concept pricing for the redesign brief.\nYearly billing shows the monthly-equivalent rate.",
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      // Confetti is pure celebration — skip it for reduced-motion users.
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;
      const rect = switchRef.current.getBoundingClientRect();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: CONFETTI_COLORS,
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  return (
    <div className="w-full">
      <div className="mb-12 space-y-4 text-center">
        <p className="section-kicker">Pricing</p>
        <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h2>
        <p className="whitespace-pre-line text-lg text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="mb-10 flex items-center justify-center gap-3">
        <span
          className={cn(
            "text-sm font-semibold",
            isMonthly ? "text-foreground" : "text-muted-foreground",
          )}
        >
          Monthly
        </span>
        <Switch
          ref={switchRef}
          checked={!isMonthly}
          onCheckedChange={handleToggle}
          aria-label="Toggle annual billing"
        />
        <span
          className={cn(
            "text-sm font-semibold",
            !isMonthly ? "text-foreground" : "text-muted-foreground",
          )}
        >
          Annual{" "}
          <span className="text-brass-deep dark:text-brass-bright">
            (Save 20%)
          </span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ y: 50, opacity: 0 }}
            whileInView={
              isDesktop
                ? {
                    y: plan.isPopular ? -20 : 0,
                    opacity: 1,
                    x: index === 2 ? -30 : index === 0 ? 30 : 0,
                    scale: index === 0 || index === 2 ? 0.94 : 1.0,
                  }
                : {}
            }
            viewport={{ once: true }}
            transition={{
              duration: 1.6,
              type: "spring",
              stiffness: 100,
              damping: 30,
              delay: 0.4,
              opacity: { duration: 0.5 },
            }}
            className={cn(
              `relative flex flex-col rounded-2xl border-[1px] bg-background p-6 text-center lg:flex lg:flex-col lg:justify-center`,
              plan.isPopular ? "border-2 border-primary" : "border-border",
              !plan.isPopular && "mt-5",
              // Fan-out tilt is desktop-only; stacked mobile cards stay flat.
              index === 0 || index === 2 ? "z-0" : "z-10",
              index === 0 && "lg:origin-right lg:rotate-y-[10deg]",
              index === 2 && "lg:origin-left lg:rotate-y-[10deg]",
            )}
          >
            {plan.isPopular && (
              <div className="absolute right-0 top-0 flex items-center rounded-bl-xl rounded-tr-xl bg-primary px-2 py-0.5">
                <Star aria-hidden="true" className="h-4 w-4 fill-current text-primary-foreground" />
                <span className="ml-1 font-sans font-semibold text-primary-foreground">
                  Popular
                </span>
              </div>
            )}
            <div className="flex flex-1 flex-col">
              <p className="text-base font-semibold text-muted-foreground">
                {plan.name}
              </p>
              <div
                className="mt-6 flex items-center justify-center gap-x-2"
                aria-live="polite"
                aria-atomic="true"
              >
                <span className="text-5xl font-bold tracking-tight text-foreground">
                  <NumberFlow
                    value={
                      isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)
                    }
                    format={{
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }}
                    transformTiming={{
                      duration: 500,
                      easing: "ease-out",
                    }}
                    willChange
                    className="tabular-nums"
                  />
                </span>
                {plan.period !== "Next 3 months" && (
                  <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                    / {plan.period}
                  </span>
                )}
              </div>

              <p className="text-xs leading-5 text-muted-foreground">
                {isMonthly ? "billed monthly" : "billed annually"}
              </p>

              <ul className="mt-5 flex flex-col gap-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check aria-hidden="true" className="mt-1 h-4 w-4 flex-shrink-0 text-brass-deep dark:text-brass-bright" />
                    <span className="text-left text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <hr className="my-4 w-full border-border" />

              <Link
                href={plan.href}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),
                  "group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter",
                  "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:bg-primary hover:text-primary-foreground",
                  plan.isPopular
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground",
                )}
              >
                {plan.buttonText}
              </Link>
              <p className="mt-6 text-xs leading-5 text-muted-foreground">
                {plan.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
