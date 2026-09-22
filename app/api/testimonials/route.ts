import { body, database, enforceOrigin, failure, field, hash, json, limit, RequestError } from "@/lib/server";
export const dynamic = "force-dynamic";
export async function GET() {
    try {
        const { results } = await database().prepare("SELECT id,name,town,message,created_at FROM testimonials WHERE status='approved' ORDER BY created_at DESC LIMIT 30").all();
        return json({ testimonials: results });
    }
    catch (error) {
        return failure(error);
    }
}
export async function POST(request: Request) {
    try {
        enforceOrigin(request);
        await limit(request, "submit", 30);
        const data = await body(request);
        if (data.website)
            throw new RequestError("We couldn’t verify this submission.", 400);
        if (data.consent !== true)
            throw new RequestError("Please agree to share your testimonial before submitting.", 400);
        const code = field(data, "code", 8, 8).toUpperCase();
        if (!/^[A-Z2-9]{8}$/.test(code))
            throw new RequestError("Enter the eight-character code from Asa.", 400);
        const name = field(data, "name", 2, 60), town = field(data, "town", 0, 60), message = field(data, "message", 20, 1500);
        const id = crypto.randomUUID();
        const result = await database().prepare("INSERT INTO testimonials (id,invitation_id,name,town,message,status,created_at) SELECT ?,i.id,?,?,?,'pending',? FROM invitations i WHERE i.code_hash=? AND i.expires_at>? AND NOT EXISTS (SELECT 1 FROM testimonials t WHERE t.invitation_id=i.id) ON CONFLICT(invitation_id) DO NOTHING").bind(id, name, town, message, Date.now(), await hash(code), Date.now()).run();
        if (!result.meta.changes)
            throw new RequestError("That code is invalid, expired, or has already been used. Please check it with Asa.", 400);
        return json({ ok: true, id, status: "pending" }, 201);
    }
    catch (error) {
        return failure(error);
    }
}
