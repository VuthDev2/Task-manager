import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../drizzle/schema";
import "dotenv/config";

// 1. Create the connection client
const client = postgres(process.env.DATABASE_URL!);

// 2. Initialize Drizzle with the  schema
export const db = drizzle(client, { schema });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in .env.local");
}