import { animate, inView } from "motion";

const EASE = [0.22, 0.61, 0.36, 1] as const;

function once(el: Element, play: () => void) {
  const stop = inView(
    el,
    () => {
      play();
      stop();
    },
    { amount: 0.25 },
  );
}

function staggerDelay(el: HTMLElement) {
  const siblings = el.parentElement
    ? Array.from(
        el.parentElement.querySelectorAll<HTMLElement>(
          ":scope > [data-motion]",
        ),
      )
    : [];
  return Math.min(Math.max(siblings.indexOf(el), 0) * 0.08, 0.4);
}

function init() {
  document.querySelectorAll<HTMLElement>("[data-motion]").forEach((el) => {
    const kind = el.dataset.motion ?? "";
    const delay = staggerDelay(el);

    switch (kind) {
      case "fade-up":
        once(el, () =>
          animate(
            el,
            {
              opacity: [0, 1],
              transform: ["translateY(28px)", "translateY(0px)"],
            },
            { duration: 0.7, delay, ease: EASE },
          ),
        );
        break;
      case "pattern-top":
        once(el, () =>
          animate(
            el,
            {
              opacity: [0, 1],
              transform: ["translateY(-70%)", "translateY(0%)"],
            },
            { duration: 0.8, ease: EASE },
          ),
        );
        break;
      case "pattern-bottom":
        once(el, () =>
          animate(
            el,
            {
              opacity: [0, 1],
              transform: ["translateY(-70%)", "translateY(0%)"],
            },
            { duration: 0.8, ease: EASE },
          ),
        );
        break;
      case "accent-left":
      case "accent-right":
        el.style.transformOrigin =
          kind === "accent-right" ? "right center" : "left center";
        once(el, () =>
          animate(
            el,
            { opacity: [0, 1], transform: ["scaleX(0)", "scaleX(1)"] },
            { duration: 0.7, delay: 0.2, ease: EASE },
          ),
        );
        break;
    }
  });

  document
    .querySelectorAll<SVGSVGElement>("svg[data-motion-underline]")
    .forEach((svg) => {
      once(svg, () =>
        animate(
          svg,
          { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"] },
          { duration: 0.9, delay: 0.25, ease: EASE },
        ),
      );
    });
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  init();
}
