import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Icon } from "@iconify/react";

export interface Testimonial {
  quote: string;
  name: string;
  context: string;
}

interface TestimonialsProps {
  items: Testimonial[];
}

function Stars() {
  return (
    <div className="flex items-center gap-1 text-secondary" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <Icon
          key={index}
          icon="lucide:star"
          className="size-4"
          style={{ fill: "currentColor", stroke: "none" }}
        />
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
