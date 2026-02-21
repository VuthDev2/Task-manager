import { db } from "./db";
import { usersTable } from "./db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("--- Starting CRUD Operations ---");

  // 1. CREATE
  console.log("Inserting a new user...");
  const newUser = await db.insert(usersTable).values({
    name: "Saravuth",
    age: 25,
    email: "saravuth@example.com",
  }).returning(); 
  console.log("User created:", newUser);

  // 2. READ
  console.log("Fetching all users...");
  const users = await db.select().from(usersTable);
  console.log("All users:", users);

  // 3. UPDATE
  console.log("Updating user age...");
  await db.update(usersTable)
    .set({ age: 26 })
    .where(eq(usersTable.email, "saravuth@example.com"));

  // 4. DELETE
  // console.log("Deleting user...");
  // await db.delete(usersTable).where(eq(usersTable.email, "saravuth@example.com"));

  console.log("--- Finished ---");
}

main().catch(console.error);