import "dotenv/config";
import { defineConfig } from "prisma/config";

const datasource = process.env.SHADOW_DATABASE_URL
  ? {
      url: process.env.DATABASE_URL ?? "",
      shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
    }
  : {
      url: process.env.DATABASE_URL ?? "",
    };

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource,
});

