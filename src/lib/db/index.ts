import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";

/**
 * Singleton Postgres client. In development the client is cached on
 * globalThis so hot reloads don't exhaust the connection pool.
 * 
 * Lazy initialization allows `next build` to succeed without DATABASE_URL.
 */
const globalForDb = globalThis as unknown as { 
  pgClient?: ReturnType<typeof postgres>;
  drizzleDb?: ReturnType<typeof drizzle<typeof schema>>;
};

function getDb() {
  if (!globalForDb.drizzleDb) {
    const client =
      globalForDb.pgClient ??
      postgres(env.DATABASE_URL, {
        max: env.NODE_ENV === "production" ? 10 : 5,
        idle_timeout: 30,
      });

    if (env.NODE_ENV !== "production") {
      globalForDb.pgClient = client;
    }

    globalForDb.drizzleDb = drizzle(client, { schema });
  }
  return globalForDb.drizzleDb;
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop: string | symbol) {
    const dbInstance = getDb();
    const value = dbInstance[prop as keyof typeof dbInstance];
    return typeof value === "function" ? value.bind(dbInstance) : value;
  },
});

export type Db = typeof db;
export { schema };
