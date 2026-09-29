import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

async function runMigration() {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl === undefined) {
    throw new Error("DATABASE_URL not provided");
  }
  const db = drizzle(dbUrl);
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Migration completed ✅");
}

runMigration().catch((error) => console.error("Error in migration process 🚨:", error));
