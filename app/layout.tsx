import type { Metadata } from "next";
import { business } from "@/content/site";
import "./globals.css";
export const metadata: Metadata = {
    metadataBase: new URL(business.url),
    title: "A & M Redwood Co | Home Projects & Property Care, Boulder Creek",
    description: "Home projects, property care and everyday help with Asa Branden and Manny Fonseca. Serving Boulder Creek, Felton and Ben Lomond. Call 831-794-3305.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
        type: "website",
        siteName: business.name,
        locale: "en_US",
        url: business.url,
        title: "A & M Redwood Co | Good People. Solid Work.",
        description: "Home projects, property care and everyday help in Boulder Creek, Felton and Ben Lomond. Call or text 831-794-3305.",
        images: [{ url: business.heroImage, width: 1920, height: 1280, alt: "Sunlight filtering through a grove of towering redwoods" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "A & M Redwood Co | Good People. Solid Work.",
        description: "Home projects, property care and everyday help in Boulder Creek, Felton and Ben Lomond.",
        images: [business.heroImage],
    },
};
export default function RootLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return <html lang="en"><body>{children}</body></html>;
}
