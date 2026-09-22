import { NextResponse, type NextRequest } from "next/server";
const CANONICAL_HOST = "amredwood.com";
// Every address the site answers on. amredwoodco.com is kept while its
// registration lasts so older links keep working; all of them land on the
// canonical origin. Local development and any other host pass through.
const KNOWN_HOSTS = new Set([CANONICAL_HOST, `www.${CANONICAL_HOST}`, "amredwoodco.com", "www.amredwoodco.com"]);
export default function proxy(request: NextRequest) {
    const url = new URL(request.url);
    const host = (request.headers.get("host") ?? url.host).toLowerCase();
    if (!KNOWN_HOSTS.has(host)) return NextResponse.next();
    // Form posts carry their own origin checks; a redirect would drop the body.
    if (url.pathname.startsWith("/api/")) return NextResponse.next();
    const secure = (request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "")) === "https";
    if (host === CANONICAL_HOST && secure) return NextResponse.next();
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 301);
}
