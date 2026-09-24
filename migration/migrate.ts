import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

async function runMigration() {
  console.log("Migration started ⌛");

  // Not using the getDbUrl helper function because we aren't copying that into our runtime app prior to deployment in our Dockerfile. We'll live with the code duplication.
  const dbUrl = (
    process.env.NODE_ENV === "production"
      ? process.env.DATABASE_URL
      : process.env.DEV_DATABASE_URL
  ) as string;

  if (!dbUrl) throw new Error("No database url found");

  const db = drizzle(process.env.DATABASE_URL!);

  await migrate(db, { migrationsFolder: "./.drizzle/migrations" });
  console.log("Migration completed ✅");
}

runMigration().catch((error) =>
  console.error("Error in migration process 🚨:", error),
);
