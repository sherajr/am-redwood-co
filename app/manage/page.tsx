import type { Metadata } from "next";
import { Manager } from "@/components/site/manager";
export const metadata: Metadata = { title: "Team access | A & M Redwood Co", robots: { index: false, follow: false } };
export default function ManagePage() { return <Manager />; }
