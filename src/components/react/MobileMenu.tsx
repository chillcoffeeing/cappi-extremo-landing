import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

import type {
  NavigationGroup,
  NavigationItem,
  NavigationLink,
} from "../../data/navigation";

interface MobileMenuProps {
  navigation: NavigationItem[];
  ctaHref: string;
  currentPath: string;
}

function isGroup(item: NavigationItem): item is NavigationGroup {
  return item.kind === "group";
}

function isActive(currentPath: string, href: string): boolean {
  return href === "/" ? currentPath === "/" : currentPath.startsWith(href);
}

function groupIsActive(group: NavigationGroup, currentPath: string): boolean {
  return group.sections.some((section) =>
    section.items.some((item) => isActive(currentPath, item.href)),
  );
}

const menuIcon = "lucide:menu";
const closeIcon = "lucide:x";
const chevronIcon = "lucide:chevron-down";

function DisclosureChevron({ open }: { open: boolean }) {
  return (
    <Icon
      icon={chevronIcon}
      aria-hidden="true"
      className={`size-5 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
    />
  );
}

interface LinkItemProps {
  link: NavigationLink;
  currentPath: string;
  onNavigate: () => void;
  indent?: boolean;
}

function LinkItem({ link, currentPath, onNavigate }: LinkItemProps) {
  const active = isActive(currentPath, link.href);

  return (
    <li>
      <a
        href={link.href}
        aria-current={active ? "page" : undefined}
        onClick={onNavigate}
        className={`flex min-h-11 items-center rounded-xl px-4 text-sm font-semibold uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none ${active ? "bg-primary/10 text-primary" : "text-neutral-700 hover:bg-primary/5 hover:text-primary"}`}
      >
        {link.label}
      </a>
    </li>
  );
}

interface GroupDisclosureProps {
  group: NavigationGroup;
  currentPath: string;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}

function GroupDisclosure({
  group,
  currentPath,
  isOpen,
  onToggle,
  onNavigate,
}: GroupDisclosureProps) {
  const panelId = `mobile-group-panel-${group.id}`;
  const triggerId = `mobile-group-trigger-${group.id}`;
  const active = groupIsActive(group, currentPath);

  return (
    <li>
      <button
        id={triggerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className={`flex min-h-12 w-full items-center justify-between gap-4 rounded-xl px-4 text-left text-base font-semibold uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary motion-reduce:transition-none ${
          active || isOpen
            ? "bg-primary/10 text-primary"
            : "text-neutral-800 hover:bg-neutral-50 hover:text-primary"
        }`}
      >
        <span>{group.label}</span>
        <DisclosureChevron open={isOpen} />
      </button>
      <div
        id={panelId}
        aria-labelledby={triggerId}
        hidden={!isOpen}
        inert={!isOpen}
        className="space-y-6 py-6 overflow-hidden bg-neutral-50 rounded-xl"
      >
        {group.sections.map((section) => (
          <section
            key={section.id}
            aria-labelledby={`mobile-section-${section.id}`}
            className="px-2"
          >
            <h3
              id={`mobile-section-${section.id}`}
              className={`text-xs font-bold tracking-[0.14em] text-primary`}
            >
              {section.label}
            </h3>
            <ul className="mt-2 space-y-1">
              {section.items.map((link) => (
                <LinkItem
                  key={link.id}
                  link={link}
                  currentPath={currentPath}
                  onNavigate={onNavigate}
                  indent
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </li>
  );
}

export default function MobileMenu({
  navigation,
  ctaHref,
  currentPath,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [openGroupIds, setOpenGroupIds] = useState<Set<string>>(
    () => new Set(),
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const closeMenu = (restoreFocus = true) => {
    setOpen(false);
    setOpenGroupIds(new Set());
    if (restoreFocus) {
      window.requestAnimationFrame(() => buttonRef.current?.focus());
    }
  };

  useEffect(() => {
    if (!open) return;

    const firstFocusable =
      panelRef.current?.querySelector<HTMLElement>("a, button");
    window.requestAnimationFrame(() => firstFocusable?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
      }
    };
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        !buttonRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  const toggleGroup = (id: string) => {
    setOpenGroupIds((ids) => {
      const nextIds = new Set(ids);
      if (nextIds.has(id)) nextIds.delete(id);
      else nextIds.add(id);
      return nextIds;
    });
  };

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => (open ? closeMenu(false) : setOpen(true))}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 text-neutral-800 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
      >
        <Icon icon={open ? closeIcon : menuIcon} className="size-6" aria-hidden="true" />
      </button>

      <div
        id="mobile-menu"
        ref={panelRef}
        inert={!open}
        aria-hidden={!open}
        className={`absolute inset-x-0 top-full z-30 max-h-[calc(100dvh-4.5rem)] origin-top overflow-y-auto border-t border-neutral-200 bg-white px-4 pb-6 pt-3 shadow-lg transition-[opacity,transform,visibility] duration-200 motion-reduce:transition-none lg:hidden ${
          open
            ? "visible scale-y-100 opacity-100"
            : "pointer-events-none invisible scale-y-95 opacity-0"
        }`}
      >
        <nav aria-label="Menú móvil">
          <ul className="flex flex-col gap-1">
            {navigation.map((item) =>
              isGroup(item) ? (
                <GroupDisclosure
                  key={item.id}
                  group={item}
                  currentPath={currentPath}
                  isOpen={openGroupIds.has(item.id)}
                  onToggle={() => toggleGroup(item.id)}
                  onNavigate={() => closeMenu(false)}
                />
              ) : (
                <LinkItem
                  key={item.id}
                  link={item}
                  currentPath={currentPath}
                  onNavigate={() => closeMenu(false)}
                />
              ),
            )}
          </ul>
          <a
            href={ctaHref}
            onClick={() => closeMenu(false)}
            className="mt-4 flex min-h-11 items-center justify-center rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
          >
            Inscribir ahora
          </a>
        </nav>
      </div>
    </div>
  );
}
