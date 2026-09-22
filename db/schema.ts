import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
export const invitations = sqliteTable("invitations", {
    id: text("id").primaryKey(),
    codeHash: text("code_hash").notNull().unique(),
    createdAt: integer("created_at").notNull(),
    expiresAt: integer("expires_at").notNull(),
});
export const testimonials = sqliteTable("testimonials", {
    id: text("id").primaryKey(),
    invitationId: text("invitation_id").notNull().unique().references(() => invitations.id),
    name: text("name").notNull(),
    town: text("town").notNull(),
    message: text("message").notNull(),
    status: text("status", { enum: ["pending", "approved", "hidden"] }).notNull().default("pending"),
    createdAt: integer("created_at").notNull(),
}, table => [index("testimonials_status_created").on(table.status, table.createdAt)]);
export const rateLimits = sqliteTable("rate_limits", {
    key: text("key").primaryKey(),
    attempts: integer("attempts").notNull().default(0),
    expiresAt: integer("expires_at").notNull(),
}, table => [index("rate_limits_expiry").on(table.expiresAt)]);
