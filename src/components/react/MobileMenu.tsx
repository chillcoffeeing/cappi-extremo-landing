import { useEffect, useRef, useState } from "react";

import menuSvg from "../../assets/ui/menu-2.svg?raw";
import xSvg from "../../assets/ui/x.svg?raw";

export interface NavLink {
	href: string;
	label: string;
}

interface MobileMenuProps {
	links: NavLink[];
	ctaHref: string;
	currentPath: string;
}

function injectClass(svg: string, cls: string) {
	return svg.replace("<svg", `<svg class="${cls}"`);
}

function isActive(currentPath: string, href: string): boolean {
	return href === "/" ? currentPath === "/" : currentPath.startsWith(href);
}

export default function MobileMenu({ links, ctaHref, currentPath }: MobileMenuProps) {
	const [open, setOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
		};
		const onPointerDown = (event: MouseEvent | TouchEvent) => {
			const target = event.target as Node;
			if (!buttonRef.current?.contains(target) && !panelRef.current?.contains(target)) {
				setOpen(false);
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

	return (
		<div className="md:hidden">
			<button
				ref={buttonRef}
				type="button"
				aria-label={open ? "Cerrar menú" : "Abrir menú"}
				aria-expanded={open}
				aria-controls="mobile-menu"
				onClick={() => setOpen((value) => !value)}
				className="inline-flex rounded-full p-2 text-neutral-800 transition-colors hover:bg-neutral-100"
				dangerouslySetInnerHTML={{ __html: open ? injectClass(xSvg, "size-6") : injectClass(menuSvg, "size-6") }}
			/>

			<div
				id="mobile-menu"
				ref={panelRef}
				inert={!open}
				className={`absolute inset-x-0 top-full origin-top border-t border-neutral-200 bg-white px-4 pb-6 pt-3 shadow-lg transition-all duration-200 md:hidden ${
					open ? "scale-y-100 opacity-100" : "pointer-events-none scale-y-95 opacity-0"
				}`}
			>
				<nav aria-label="Menú móvil">
					<ul className="flex flex-col gap-1">
						{links.map((link) => (
							<li key={link.href}>
								<a
									href={link.href}
									aria-current={isActive(currentPath, link.href) ? "page" : undefined}
									onClick={() => setOpen(false)}
									className={`block rounded-full px-4 py-2.5 text-base font-medium uppercase transition-colors ${
										isActive(currentPath, link.href)
											? "bg-primary/10 font-semibold text-primary"
											: "text-neutral-700 hover:bg-neutral-50 hover:text-primary"
									}`}
								>
									{link.label}
								</a>
							</li>
						))}
					</ul>
					<a
						href={ctaHref}
						onClick={() => setOpen(false)}
						className="mt-4 block rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Inscribir ahora
					</a>
				</nav>
			</div>
		</div>
	);
}
