"use client";
import { FormEvent, useState } from "react";
import { ArrowLeft, Copy, KeyRound, LogOut } from "lucide-react";
type Review = {
    id: string;
    name: string;
    town: string;
    message: string;
    status: string;
    created_at: number;
};
export function Manager() {
    const [key, setKey] = useState(""), [unlocked, setUnlocked] = useState(false), [reviews, setReviews] = useState<Review[]>([]), [error, setError] = useState(""), [busy, setBusy] = useState(false), [code, setCode] = useState(""), [expiresAt, setExpiresAt] = useState(0), [copied, setCopied] = useState(false);
    async function api(method = "GET", data?: object) { const r = await fetch("/api/manage", { method, headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, ...(data ? { body: JSON.stringify(data) } : {}) }); const result = await r.json() as {
        error?: string;
        testimonials: Review[];
        code: string;
        expiresAt: number;
    }; if (!r.ok)
        throw new Error(result.error || "Please try again."); return result; }
    async function unlock(e: FormEvent) { e.preventDefault(); setBusy(true); setError(""); try {
        const result = await api();
        setReviews(result.testimonials);
        setUnlocked(true);
    }
    catch (e) {
        setError(e instanceof Error ? e.message : "Couldn’t connect.");
    }
    finally {
        setBusy(false);
    } }
    async function create() { setBusy(true); setError(""); try {
        const result = await api("POST", { action: "create_code" });
        setCode(result.code);
        setExpiresAt(result.expiresAt);
        setCopied(false);
    }
    catch (e) {
        setError(e instanceof Error ? e.message : "Couldn’t create a code.");
    }
    finally {
        setBusy(false);
    } }
    async function moderate(id: string, status: string) { setBusy(true); setError(""); try {
        await api("POST", { action: "moderate", id, status });
        setReviews(items => items.map(r => r.id === id ? { ...r, status } : r));
    }
    catch (e) {
        setError(e instanceof Error ? e.message : "Couldn’t save the change.");
    }
    finally {
        setBusy(false);
    } }
    return <main className="manage-page"><div className="manage-top"><a className="text-link" href="/"><ArrowLeft size={16}/> Back to the website</a>{unlocked && <button className="text-link" onClick={() => { setKey(""); setReviews([]); setCode(""); setUnlocked(false); }}><LogOut size={16}/> Lock</button>}</div><p className="eyebrow">A & M REDWOOD CO / TEAM ACCESS</p><h1>Good words. In good hands.</h1><p>Create customer codes and review testimonials before they go live.</p>{error && <p className="form-error manage-error" role="alert">{error}</p>}
  {!unlocked ? <form className="manage-login" onSubmit={unlock}><label className="field"><span>Team access key</span><input type="password" value={key} onChange={e => setKey(e.target.value)} required autoComplete="off" placeholder="Enter your private access key"/></label><button type="submit" className="button button-dark" disabled={busy}><KeyRound size={17}/>{busy ? "Checking…" : "Open team area"}</button><p className="form-note">Ask the site owner for your access key. It stays only in this open page and is cleared when you leave or lock the area.</p></form> : <>
  <div className="manage-toolbar"><button className="button button-dark" onClick={create} disabled={busy}>Create a customer code</button></div>
  {code && <div className="manage-code" role="status"><p>Share this code with one customer:</p><strong>{code}</strong><p>Valid once, until {new Date(expiresAt).toLocaleDateString()}. Save it now; we don’t store the readable code.</p><button className="text-link" onClick={async () => { try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
        }
        catch {
            setError("Please select and copy the code above.");
        } }}><Copy size={15}/>{copied ? "Copied" : "Copy code"}</button></div>}
  <div className="manage-list">{reviews.length === 0 ? <p className="manage-empty">No testimonials yet. Create a code and share it after a job.</p> : reviews.map(review => <article className="manage-review" key={review.id}><header><span><strong>{review.name}</strong>{review.town ? ` · ${review.town}` : ""} · {new Date(review.created_at).toLocaleDateString()}</span><span className="status-pill">{review.status}</span></header><blockquote>{review.message}</blockquote><footer>{review.status !== "approved" && <button disabled={busy} onClick={() => moderate(review.id, "approved")}>Approve & publish</button>}{review.status !== "hidden" && <button disabled={busy} onClick={() => moderate(review.id, "hidden")}>Keep private</button>}{review.status !== "pending" && <button disabled={busy} onClick={() => moderate(review.id, "pending")}>Return to pending</button>}</footer></article>)}</div></>}
  </main>;
}
