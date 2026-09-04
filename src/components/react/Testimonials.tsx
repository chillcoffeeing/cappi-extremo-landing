import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

export interface Testimonial {
  quote: string;
  name: string;
  context: string;
}

interface TestimonialsProps {
  items: Testimonial[];
}

// Tabler Icons (ISC) - filled star, viewBox 24×24
const STAR_PATH =
  "M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z";

function Stars() {
  return (
    <div className="flex items-center gap-1 text-primary" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          className="size-4"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials({ items }: TestimonialsProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    AutoScroll({
      speed: 0.4,
      stopOnMouseEnter: true,
      stopOnInteraction: false,
    }),
  ]);

  if (items.length === 0) return null;

  return (
    <div className="carousel-fade">
      <div role="region" aria-label="Testimonios de familias">
        <div className="-my-6 overflow-hidden py-6" ref={emblaRef}>
          <ul className="flex">
            {items.map((testimonial) => (
              <li
                key={testimonial.name}
                className="min-w-0 shrink-0 grow-0 basis-full pr-6 sm:basis-1/2 lg:basis-1/4"
              >
                <figure className="flex h-full flex-col bg-white p-6 shadow-sm">
                  <Stars />
                  <blockquote className="mt-4 text-base leading-relaxed text-neutral-600">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-auto pt-6">
                    <p className="font-semibold text-neutral-900">
                      {testimonial.name}
                    </p>
                    <p className="mt-0.5 font-light text-neutral-500">
                      {testimonial.context}
                    </p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
