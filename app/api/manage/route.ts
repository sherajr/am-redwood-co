import { body, database, failure, field, hash, json, requireManager, RequestError } from "@/lib/server";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
    try {
        await requireManager(request);
        const { results } = await database().prepare("SELECT id,name,town,message,status,created_at FROM testimonials ORDER BY created_at DESC LIMIT 200").all();
        return json({ testimonials: results });
    }
    catch (error) {
        return failure(error);
    }
}
export async function POST(request: Request) {
    try {
        await requireManager(request);
        const data = await body(request);
        if (data.action === "create_code") {
            const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            const bytes = crypto.getRandomValues(new Uint8Array(8));
            const code = Array.from(bytes, b => alphabet[b % 32]).join("");
            const expiresAt = Date.now() + 30 * 86400000;
            await database().prepare("INSERT INTO invitations (id,code_hash,created_at,expires_at) VALUES (?,?,?,?)").bind(crypto.randomUUID(), await hash(code), Date.now(), expiresAt).run();
            return json({ code, expiresAt }, 201);
        }
        if (data.action === "moderate") {
            const id = field(data, "id", 1, 80);
            const status = field(data, "status", 1, 12);
            if (!["approved", "hidden", "pending"].includes(status))
                throw new RequestError("Choose a valid review status.", 400);
            const result = await database().prepare("UPDATE testimonials SET status=? WHERE id=?").bind(status, id).run();
            if (!result.meta.changes)
                throw new RequestError("This testimonial could not be found.", 404);
            return json({ ok: true });
        }
        throw new RequestError("Unknown action.", 400);
    }
    catch (error) {
        return failure(error);
    }
}
