"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: "custom-rise" | "custom-fade-in";
  delayMs?: number;
}

export function ScrollReveal({ children, className, animation = "custom-rise", delayMs = 0, ...props }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" } // Trigger slightly before it enters fully
    );

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
