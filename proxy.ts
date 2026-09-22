import { NextResponse, type NextRequest } from "next/server";
const CANONICAL_HOST = "amredwoodco.com";
// The live site answers on one address: www and plain HTTP move to the canonical
// origin. Local development and any other host pass through untouched.
export default function proxy(request: NextRequest) {
    const url = new URL(request.url);
    const host = (request.headers.get("host") ?? url.host).toLowerCase();
    if (host !== CANONICAL_HOST && host !== `www.${CANONICAL_HOST}`) return NextResponse.next();
    // Form posts carry their own origin checks; a redirect would drop the body.
    if (url.pathname.startsWith("/api/")) return NextResponse.next();
    const secure = (request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "")) === "https";
    if (host === CANONICAL_HOST && secure) return NextResponse.next();
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 301);
}
