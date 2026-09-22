import { env } from "cloudflare:workers";
export class RequestError extends Error {
    constructor(message: string, public status: number) { super(message); }
}
export function database(): D1Database {
    if (!env.DB)
        throw new RequestError("Testimonials are temporarily unavailable. Please try again later.", 503);
    return env.DB;
}
export function json(data: unknown, status = 200) { return Response.json(data, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } }); }
export function failure(error: unknown) {
    if (error instanceof RequestError)
        return json({ error: error.message }, error.status);
    console.error("Testimonial operation failed", error instanceof Error ? error.message : "unknown error");
    return json({ error: "We couldn’t save that right now. Your message is still here; please try again." }, 503);
}
export function enforceOrigin(request: Request) {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin)
        throw new RequestError("Please use the form on our website.", 403);
    if (request.headers.get("sec-fetch-site") === "cross-site")
        throw new RequestError("Please use the form on our website.", 403);
}
export async function body(request: Request): Promise<Record<string, unknown>> {
    if (!request.headers.get("content-type")?.includes("application/json"))
        throw new RequestError("Please submit the website form.", 415);
    if (Number(request.headers.get("content-length")) > 12000)
        throw new RequestError("This message is too long.", 413);
    const reader = request.body?.getReader();
    if (!reader)
        throw new RequestError("Please complete the form.", 400);
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
        const result = await reader.read();
        if (result.done)
            break;
        size += result.value.byteLength;
        if (size > 12000) {
            await reader.cancel();
            throw new RequestError("This message is too long.", 413);
        }
        chunks.push(result.value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.length;
    }
    let parsed: unknown;
    try {
        parsed = JSON.parse(new TextDecoder().decode(bytes));
    }
    catch {
        throw new RequestError("Please complete the form.", 400);
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
        throw new RequestError("Please complete the form.", 400);
    return parsed as Record<string, unknown>;
}
export function field(data: Record<string, unknown>, name: string, min: number, max: number): string {
    const value = data[name];
    if (typeof value !== "string")
        throw new RequestError(`Please check the ${name} field.`, 400);
    const clean = value.trim();
    if (clean.length < min || clean.length > max)
        throw new RequestError(`Please keep the ${name} between ${min} and ${max} characters.`, 400);
    return clean;
}
export async function hash(value: string) { const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)); return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join(""); }
export async function limit(request: Request, scope: string, max: number) {
    const now = Date.now();
    const window = Math.floor(now / 3600000);
    const address = request.headers.get("cf-connecting-ip") ?? "unknown";
    const key = await hash(`${scope}:${window}:${address}`);
    const db = database();
    const result = await db.prepare("INSERT INTO rate_limits (key,attempts,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=attempts+1 RETURNING attempts").bind(key, (window + 1) * 3600000).first<{
        attempts: number;
    }>();
    // Bound routine cleanup; never retain visitors' raw IP addresses.
    await db.prepare("DELETE FROM rate_limits WHERE key IN (SELECT key FROM rate_limits WHERE expires_at < ? LIMIT 100)").bind(now).run();
    if ((result?.attempts ?? 0) > max)
        throw new RequestError("Too many attempts. Please try again in an hour.", 429);
}
export async function requireManager(request: Request) {
    enforceOrigin(request);
    const expected = env.MANAGEMENT_KEY;
    if (!expected || expected.length < 32)
        throw new RequestError("Team access hasn’t been activated yet. Please contact the site owner.", 503);
    const provided = request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
    const [a, b] = await Promise.all([hash(provided), hash(expected)]);
    let diff = 0;
    for (let i = 0; i < a.length; i++)
        diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    if (diff !== 0) {
        await limit(request, "manage", 20);
        throw new RequestError("That access key isn’t valid.", 401);
    }
}
