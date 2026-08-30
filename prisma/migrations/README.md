# Prisma Migrations

This directory stores generated Prisma migration files.

The Phase 3 initial migration was generated with:

```bash
prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script --output prisma/migrations/20260630000000_phase_3_init/migration.sql
```

After dependencies and a PostgreSQL database URL are available, apply migrations locally with:

```bash
pnpm db:migrate
```

For production deploys:

```bash
pnpm db:deploy
```

Do not hand-write production migrations here unless a later phase explicitly requires a reviewed manual SQL change.
