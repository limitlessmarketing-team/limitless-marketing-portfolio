import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Inbound mockup requests from the contact form.
 * Run `npm run db:generate` after changing this file, then deploy so the
 * platform applies the generated migration to the real D1 database.
 */
export const leads = sqliteTable(
  "leads",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    business: text("business").notNull().default(""),
    phone: text("phone").notNull().default(""),
    email: text("email").notNull().default(""),
    message: text("message").notNull().default(""),
    /** Best-effort context for follow-up and spam triage. */
    source: text("source").notNull().default("website"),
    userAgent: text("user_agent").notNull().default(""),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("leads_created_at_idx").on(table.createdAt)]
);
