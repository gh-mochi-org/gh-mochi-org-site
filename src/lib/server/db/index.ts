import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { NEON_DB_CONNECTION_STRING } from "$env/static/private";

const sql = neon(NEON_DB_CONNECTION_STRING);
export const db = drizzle(sql, { schema });

export * from "./schema";
