/** Progressive enhancement. No browser dependency and no automatic submission. */
type ModelContext = {
    registerTool(tool: {
        name: string;
        title: string;
        description: string;
        inputSchema: object;
        annotations: object;
        execute: (input: unknown) => unknown;
    }, options: {
        signal: AbortSignal;
    }): void | Promise<void>;
};
export function registerReviewTool(start: (input: {
    code?: string;
}) => void) {
    const context = (document as Document & {
        modelContext?: ModelContext;
    }).modelContext;
    if (!context?.registerTool)
        return;
    const lifecycle = new AbortController();
    try {
        Promise.resolve(context.registerTool({ name: "start_testimonial", title: "Open customer testimonial form", description: "Open A & M Redwood Co’s testimonial form, optionally entering the customer's code. This only prepares the form; it does not submit or publish a testimonial.", inputSchema: { type: "object", properties: { code: { type: "string", pattern: "^[A-Za-z2-9]{8}$" } }, additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, async execute(input) { if (!input || typeof input !== "object" || Array.isArray(input))
                throw new Error("Expected an object."); const data = input as Record<string, unknown>; if (Object.keys(data).some(k => k !== "code"))
                throw new Error("Unknown field."); if (data.code !== undefined && (typeof data.code !== "string" || !/^[A-Za-z2-9]{8}$/.test(data.code)))
                throw new Error("Use the eight-character code from Asa."); start({ code: typeof data.code === "string" ? data.code.toUpperCase() : undefined }); await new Promise<void>(resolve => requestAnimationFrame(() => resolve())); return { opened: true, submitted: false }; } }, { signal: lifecycle.signal })).catch(() => { });
    }
    catch { }
    return () => lifecycle.abort();
}
