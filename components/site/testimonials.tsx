"use client";
import { FormEvent, useEffect, useState } from "react";
import { ArrowUpRight, CheckCircle2, MessageSquareQuote, Quote } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Checkbox } from "@/components/ui/checkbox";
import { registerReviewTool } from "@/lib/webmcp";
type Review = {
    id: string;
    name: string;
    town: string;
    message: string;
};
export function Testimonials() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadState, setLoadState] = useState("loading");
    const [open, setOpen] = useState(false), [code, setCode] = useState(""), [name, setName] = useState(""), [town, setTown] = useState(""), [message, setMessage] = useState(""), [consent, setConsent] = useState(false), [website, setWebsite] = useState("");
    const [busy, setBusy] = useState(false), [error, setError] = useState(""), [success, setSuccess] = useState(false);
    useEffect(() => { const controller = new AbortController(); fetch("/api/testimonials", { signal: controller.signal }).then(async (r) => { if (!r.ok)
        throw new Error(); return r.json() as Promise<{
        testimonials: Review[];
    }>; }).then(data => { setReviews(data.testimonials); setLoadState("ready"); }).catch(e => { if (e.name !== "AbortError")
        setLoadState("error"); }); return () => controller.abort(); }, []);
    useEffect(() => registerReviewTool(input => { if (input.code)
        setCode(input.code); setOpen(true); }), []);
    async function submit(event: FormEvent) {
        event.preventDefault();
        setError("");
        if (code.length !== 8) {
            setError("Enter the eight-character code from Asa.");
            return;
        }
        if (!consent) {
            setError("Please agree to share your testimonial.");
            return;
        }
        setBusy(true);
        try {
            const response = await fetch("/api/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, name, town, message, consent, website }) });
            const data = await response.json() as {
                error?: string;
            };
            if (!response.ok)
                throw new Error(data.error || "Please try again.");
            setSuccess(true);
            setCode("");
            setName("");
            setTown("");
            setMessage("");
            setConsent(false);
        }
        catch (e) {
            setError(e instanceof Error ? e.message : "We couldn’t connect. Please try again.");
        }
        finally {
            setBusy(false);
        }
    }
    return <section className="testimonials-section" id="neighbors"><div className="wrap"><div className="testimonials-heading"><div><p className="eyebrow">04 / WORD AROUND THE MOUNTAINS</p><h2>Good work gets around.</h2></div><button className="text-link" onClick={() => { setSuccess(false); setOpen(true); }}>Have a code? Leave a kind word <ArrowUpRight size={17}/></button></div>
    {reviews.length > 0 ? <div className="reviews-grid">{reviews.map(review => <article className="review" key={review.id}><Quote size={23} strokeWidth={1.3}/><blockquote>“{review.message}”</blockquote><cite>{review.name}{review.town && <span>{review.town}</span>}</cite><small>Shared with a customer code</small></article>)}</div> : <div className="testimonial-empty"><MessageSquareQuote size={30} strokeWidth={1.3}/><div><h3>{loadState === "error" ? "Kind words will be back soon." : loadState === "loading" ? "A few words from our neighbors…" : "Every good reputation starts somewhere."}</h3><p>{loadState === "error" ? "We couldn’t load testimonials right now. You can still call or text us about your project." : loadState === "loading" ? "Loading customer testimonials." : "Worked with Asa and Manny? Ask Asa for a code and share your experience. We’d love to hear from you."}</p></div></div>}
    <Dialog open={open} onOpenChange={next => { if (!busy)
        setOpen(next); }}><DialogContent className="review-dialog"><DialogHeader><DialogTitle>Leave a kind word.</DialogTitle><DialogDescription>For customers of A & M Redwood Co. Use the single-use code Asa shared with you.</DialogDescription></DialogHeader>{success ? <div className="form-success" role="status"><CheckCircle2 size={42} strokeWidth={1.5}/><h3>Thank you for sharing.</h3><p>Your testimonial has been received. Asa will review it before it appears on the website.</p><button className="button button-dark" onClick={() => setOpen(false)}>Back to the mountains</button></div> : <form className="review-form" onSubmit={submit}>
      <div className="field"><label htmlFor="review-code">Your code</label><InputOTP pushPasswordManagerStrategy="none" id="review-code" inputMode="text" autoCapitalize="characters" spellCheck={false} maxLength={8} value={code} onChange={v => setCode(v.toUpperCase())} pattern="[a-zA-Z2-9]*" autoComplete="off" aria-describedby="code-help"><InputOTPGroup>{Array.from({ length: 8 }, (_, i) => <InputOTPSlot index={i} className="code-slot" key={i}/>)}</InputOTPGroup></InputOTP><small id="code-help">Eight characters. Each code works once and expires after 30 days.</small></div>
      <div className="form-pair"><label className="field"><span>Display name</span><input value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={60} placeholder="First name + last initial" autoComplete="name"/></label><label className="field"><span>Town <small>(optional)</small></span><input value={town} onChange={e => setTown(e.target.value)} maxLength={60} placeholder="e.g. Felton" autoComplete="address-level2"/></label></div>
      <label className="field"><span>Your experience</span><textarea value={message} onChange={e => setMessage(e.target.value)} required minLength={20} maxLength={1500} placeholder="What did we help you with? How did it go?"/><small className="counter">{message.length} / 1,500</small></label>
      <div className="visually-hidden-field" aria-hidden="true"><label>Website<input tabIndex={-1} value={website} onChange={e => setWebsite(e.target.value)} autoComplete="off"/></label></div>
      <label className="consent"><Checkbox checked={consent} onCheckedChange={v => setConsent(v === true)} aria-label="I agree to publish my testimonial"/><span>I agree that my display name, town, and testimonial may be published on this website after review.</span></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-dark" disabled={busy} type="submit">{busy ? "Sending your words…" : "Submit testimonial"}<ArrowUpRight size={17}/></button><p className="form-note">Your code stays private. Please leave out addresses, contact information, and other sensitive details.</p>
    </form>}</DialogContent></Dialog>
  </div></section>;
}
