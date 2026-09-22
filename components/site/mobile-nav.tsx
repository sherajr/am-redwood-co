"use client";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
export function MobileNav() { return <div className="mobile-nav"><Sheet><SheetTrigger className="menu-button" aria-label="Open navigation"><Menu /></SheetTrigger><SheetContent className="mobile-sheet"><SheetTitle>A & M Redwood Co</SheetTitle><nav aria-label="Mobile navigation">{[["#services", "What we do"], ["#about", "Who we are"], ["#neighbors", "Kind words"], ["#contact", "Get in touch"]].map(([href, label]) => <SheetClose asChild key={href}><a href={href}>{label}</a></SheetClose>)}</nav></SheetContent></Sheet></div>; }
