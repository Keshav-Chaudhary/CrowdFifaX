"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: "custom-rise" | "custom-fade-in";
  delayMs?: number;
}

/** Creates an IntersectionObserver that marks the element visible once it enters view. */
function makeRevealObserver(onVisible: () => void): IntersectionObserver {
  return new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) onVisible(); },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );
}

export function ScrollReveal({
  children,
  className,
  animation = "custom-rise",
  delayMs = 0,
  ...props
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = makeRevealObserver(() => {
      setIsVisible(true);
      observer.disconnect();
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(className, isVisible ? animation : "opacity-0")}
      style={{ animationDelay: isVisible ? `${delayMs}ms` : undefined }}
      {...props}
    >
      {children}
    </div>
  );
}
