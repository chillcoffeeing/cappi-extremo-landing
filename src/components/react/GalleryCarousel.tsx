import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { animate } from "motion";

export interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryCarouselProps {
  images: GalleryImage[];
  direction?: "right" | "left";
}

interface LightboxState {
  src: string;
  alt: string;
  rect: DOMRect;
}

const EASE = [0.22, 0.61, 0.36, 1] as const;

function getFinalSize(
  img: HTMLImageElement,
  thumbRect: DOMRect,
): { w: number; h: number } {
  const vw = window.innerWidth || 1;
  const vh = window.innerHeight || 1;
  const maxW = vw * 0.9;
  const maxH = vh * 0.85;

  const natW = img.naturalWidth || thumbRect.width;
  const natH = img.naturalHeight || thumbRect.height;

  const scale = Math.min(maxW / natW, maxH / natH, 1);
  return { w: natW * scale, h: natH * scale };
}

function centeredPos(w: number, h: number) {
  return {
    x: ((window.innerWidth || 1) - w) / 2,
    y: ((window.innerHeight || 1) - h) / 2,
  };
}

export default function GalleryCarousel({
  images,
  direction = "right",
}: GalleryCarouselProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    AutoScroll({
      speed: 0.4,
      direction: direction === "right" ? "forward" : "backward",
      stopOnMouseEnter: true,
      stopOnInteraction: false,
    }),
  ]);

  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const animCtrl = useRef<ReturnType<typeof animate> | null>(null);

  const cancel = () => {
    animCtrl.current?.stop();
    animCtrl.current = null;
  };

  const open = useCallback((image: GalleryImage, rect: DOMRect) => {
    cancel();
    setLightbox({ src: image.src, alt: image.alt, rect });
  }, []);

  const close = useCallback(() => {
    const img = imgRef.current;
    const state = lightbox;
    if (!img || !state) {
      setLightbox(null);
      return;
    }

    cancel();
    const { rect } = state;
    const { w: fw, h: fh } = getFinalSize(img, rect);
    const { x: cx, y: cy } = centeredPos(fw, fh);

    img.style.willChange = "transform, border-radius";
    animCtrl.current = animate(
      img,
      {
        x: [cx, rect.left],
        y: [cy, rect.top],
        width: [fw, rect.width],
        height: [fh, rect.height],
        borderRadius: ["0.5rem", "0px"],
      },
      { duration: 0.35, ease: EASE },
    );
    animCtrl.current.then(() => {
      img.style.willChange = "";
      animCtrl.current = null;
      setLightbox(null);
    });
  }, [lightbox]);

  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightbox, close]);

  useEffect(() => {
    if (!lightbox || !imgRef.current) return;
    const img = imgRef.current;
    const { rect } = lightbox;

    const playOpen = () => {
      const { w: fw, h: fh } = getFinalSize(img, rect);
      const { x: cx, y: cy } = centeredPos(fw, fh);

      img.style.willChange = "transform, border-radius";
      animCtrl.current = animate(
        img,
        {
          x: [rect.left, cx],
          y: [rect.top, cy],
          width: [rect.width, fw],
          height: [rect.height, fh],
          borderRadius: ["0px", "0.5rem"],
        },
        { duration: 0.4, ease: EASE },
      );
      animCtrl.current.then(() => {
        img.style.willChange = "";
        animCtrl.current = null;
      });
    };

    if (img.complete && img.naturalWidth > 0) {
      playOpen();
    } else {
      img.onload = playOpen;
    }

    return () => {
      img.onload = null;
    };
  }, [lightbox]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="carousel-fade">
      <div
        role="region"
        aria-label="Galería de fotos"
        className="-my-6 overflow-hidden py-6"
        ref={emblaRef}
      >
        <ul className="flex">
          {images.map((image) => (
            <li
              key={image.src}
              className="min-w-0 shrink-0 grow-0 basis-1/2 pr-4 sm:basis-1/3 sm:pr-6 lg:basis-1/4"
            >
              <button
                type="button"
                onClick={(e) =>
                  open(image, e.currentTarget.getBoundingClientRect())
                }
                className="group relative block aspect-square w-full overflow-hidden shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className="absolute inset-0 bg-neutral-950/0 transition-colors duration-300 group-hover:bg-neutral-950/20"
                  aria-hidden="true"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/90"
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada de imagen"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 sm:right-6 sm:top-6"
            aria-label="Cerrar"
          >
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <img
            ref={imgRef}
            src={lightbox.src}
            alt={lightbox.alt}
            className="absolute max-w-none object-contain shadow-2xl"
            style={{
              left: 0,
              top: 0,
              width: lightbox.rect.width,
              height: lightbox.rect.height,
              borderRadius: 0,
              x: lightbox.rect.left,
              y: lightbox.rect.top,
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
