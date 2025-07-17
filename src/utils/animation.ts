import { gsap } from "gsap";

export function fade(
  elementSelector: string,
  options?: {
    startOpacity?: number;
    endOpacity?: number;
    startOffset?: number | string;
    endOffset?: number | string;
    duration?: number;
    stagger?: number;
  }
) {
  const {
    startOpacity = 0,
    endOpacity = 1,
    startOffset = "100%",
    endOffset = "0%",
    duration = 0.25,
    stagger = 0.025,
  } = options ?? {};

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  return new Promise<void>((resolve) => {
    const to: gsap.TweenVars = {
      opacity: endOpacity,
      y: endOffset,
      filter: "blur(0px) hue-rotate(0deg)",
      onComplete: resolve,
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
          duration,
          stagger,
          ease: "power4.inOut",
        }
      );
    }
  });
}
