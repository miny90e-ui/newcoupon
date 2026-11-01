// Local development only: runs a throwaway PostgreSQL server on port 5433
// so you can work on the site without installing Postgres.
// Production (Hostinger VPS) uses a real PostgreSQL install — see DEPLOY.md.
import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "node:fs";

const dir = "./.local-db";
const pg = new EmbeddedPostgres({
  databaseDir: dir,
  user: "newcoupon",
  password: "newcoupon",
  port: 5433,
  persistent: true,
});

if (!existsSync(dir)) await pg.initialise();
await pg.start();
try {
  await pg.createDatabase("newcoupon");
} catch {
  // already exists
}
console.log(
  'Local Postgres ready. DATABASE_URL="postgresql://newcoupon:newcoupon@localhost:5433/newcoupon"'
);
const stop = async () => {
  await pg.stop();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
