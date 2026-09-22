"use client";
import { useEffect } from "react";
export function Motion() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return;
        const elements = document.querySelectorAll<HTMLElement>(".reveal");
        const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        } }), { threshold: 0.08 });
        elements.forEach(el => { el.classList.add("will-reveal"); observer.observe(el); });
        const hero = document.querySelector<HTMLElement>(".hero-image");
        let frame = 0;
        const onScroll = () => { if (frame)
            return; frame = requestAnimationFrame(() => { if (hero && window.scrollY < window.innerHeight * 1.5)
            hero.style.transform = `translate3d(0,${Math.min(window.scrollY * .18, 160)}px,0) scale(1.04)`; frame = 0; }); };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); elements.forEach(el => el.classList.remove("will-reveal")); };
    }, []);
    return null;
}
