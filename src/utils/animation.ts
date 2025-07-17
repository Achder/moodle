import { gsap } from "gsap";

export function fadeIn(
  elementSelector: string,
  scrollTriggerSelector?: string,
  options?: {
    startOpacity?: number;
    startOffset?: number | string;
    scrub?: boolean;
    duration?: number;
    stagger?: number;
  }
) {
  const {
    startOpacity = 0,
    startOffset = "100%",
    scrub,
    duration = 0.3,
    stagger = 0.1,
  } = options ?? {};

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const to: gsap.TweenVars = {
    opacity: 1,
    y: 0,
    filter: "blur(0px) hue-rotate(0deg)",
  };

  if (prefersReducedMotion) {
    gsap.to(elementSelector, to);
  } else {
    gsap.fromTo(
      elementSelector,
      {
        opacity: startOpacity,
        y: startOffset,
        filter: "blur(2px) hue-rotate(180deg)",
      },
      {
        ...to,
        scrollTrigger: scrollTriggerSelector
          ? {
              trigger: scrollTriggerSelector,
              start: "top bottom-=100px",
              end: "bottom top",
              scrub,
            }
          : undefined,
        duration,
        stagger,
        ease: "power4.out",
      }
    );
  }
}
