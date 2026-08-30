# Phase 4 - Authentication and Admin Access

## Status

Phase 4 adds the authentication foundation:

- Auth.js / NextAuth route handler
- Credentials provider
- Optional Google OAuth provider
- Prisma adapter
- Password hashing helpers
- Session helpers
- Role-based access helpers
- Protected `/admin` route group
- Admin login page
- Admin dashboard shell

## Environment Variables

Required for real authentication:

```bash
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

Optional Google login:

```bash
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

`AUTH_SECRET` remains in `.env.example` as a compatible alias, but `NEXTAUTH_SECRET` is the primary variable for this NextAuth v4 setup.

## Admin Login Behavior

- Credentials login requires an active user with `passwordHash`.
- Google login is shown only when Google OAuth credentials are configured.
- Google sign-in is allowed only for an existing active database user.
- Admin access requires one of the configured roles: Super Admin, Admin, Editor, Sales, or Viewer.

## Setup Note

The Phase 3 seed creates an invited bootstrap admin from `ADMIN_BOOTSTRAP_EMAIL`, but it does not set a password. A secure password setup/invite flow should be implemented before production use.

