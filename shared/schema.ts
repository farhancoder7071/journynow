import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  role: text("role").notNull().default("user"),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: text("action").notNull(),
  category: text("category").notNull(),
  timestamp: text("timestamp").notNull(),
  status: text("status").notNull(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(),
  lastUpdated: text("last_updated").notNull(),
  status: text("status").notNull().default("public"),
});

export const contents = pgTable("contents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  publishedDate: text("published_date").notNull(),
  status: text("status").notNull().default("public"),
  summary: text("summary").notNull(),
  views: integer("views").notNull().default(0),
  author: text("author").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
});

export const insertActivitySchema = createInsertSchema(activities);
export const insertDocumentSchema = createInsertSchema(documents);
export const insertContentSchema = createInsertSchema(contents);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Content = typeof contents.$inferSelect;
