import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Newsletter subscribers
export const newsletter_subscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  subscribed_at: timestamp("subscribed_at").defaultNow().notNull(),
});

// Supporters (one-time payments) and Sponsors (recurring)
export const supporters = pgTable("supporters", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  amount: varchar("amount", { length: 50 }),
  type: varchar("type", { length: 20 }).notNull().default("supporter"),
  helio_tx_id: varchar("helio_tx_id", { length: 255 }),
  paid_at: timestamp("paid_at").defaultNow().notNull(),
  visible: boolean("visible").default(true).notNull(),
});

// Projects
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  repo_url: varchar("repo_url", { length: 500 }),
  stars: integer("stars").default(0),
  forks: integer("forks").default(0),
  tags: jsonb("tags").$type<string[]>().default([]),
  featured: boolean("featured").default(false).notNull(),
  order: integer("order").default(0),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// News / Updates
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  body: text("body").notNull().default(""),
  excerpt: text("excerpt"),
  published: boolean("published").default(false).notNull(),
  published_at: timestamp("published_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Contributors
export const contributors = pgTable("contributors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  github: varchar("github", { length: 255 }).notNull().unique(),
  avatar_url: varchar("avatar_url", { length: 500 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
