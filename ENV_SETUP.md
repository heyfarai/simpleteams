# Environment Variables Setup

This monorepo uses a **hybrid approach** for environment variables: shared variables at the root, with app-specific overrides in each app.

## Quick Start

1. **Copy root template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your credentials** in `.env.local` (Supabase, Stripe, Sanity, etc.)

3. **That's it!** All apps will inherit these shared variables.

## Structure

```
simpleteams/
├── .env.local                    # SHARED vars (Supabase, Stripe, Sanity)
├── apps/
│   ├── league-web/
│   │   └── .env.local           # App-specific overrides (optional)
│   ├── front-office/
│   │   └── .env.local           # App-specific overrides (optional)
│   └── chat/
│       └── .env.local           # App-specific overrides (optional)
```

## How It Works

### Inheritance Model

1. **Root `.env.local`** is loaded first (shared infrastructure)
2. **App `.env.local`** can override or add app-specific variables
3. Apps automatically inherit from root

### Shared Variables (Root)

Defined in **root `.env.local`**:

- ✅ Supabase credentials
- ✅ Stripe keys
- ✅ Sanity CMS config
- ✅ Postmark email
- ✅ Auth secrets
- ✅ Active season ID

### App-Specific Variables

Each app can define its own:

**league-web** (`apps/league-web/.env.local`):
- `NEXT_PUBLIC_APP_URL` - Public site URL
- Feature flags (registration, payments)
- Analytics IDs

**front-office** (`apps/front-office/.env.local`):
- `NEXT_PUBLIC_APP_URL` - Admin dashboard URL
- `REQUIRE_ADMIN_AUTH=true`
- Admin-specific feature flags

**chat** (`apps/chat/.env.local`):
- `EXPO_PUBLIC_API_URL` - Backend API endpoint
- `EXPO_PUBLIC_SUPABASE_URL` - Supabase (with Expo prefix)
- Push notification config

## Development Setup

### Option 1: Minimal Setup (Recommended for Starting)

Just use the root `.env.local`:

```bash
# Copy and fill root template
cp .env.example .env.local

# All apps work immediately
pnpm dev
```

### Option 2: Per-App Customization

If you need app-specific configs:

```bash
# Root (required)
cp .env.example .env.local

# App-specific (optional)
cp apps/league-web/.env.example apps/league-web/.env.local
cp apps/front-office/.env.example apps/front-office/.env.local
cp apps/chat/.env.example apps/chat/.env.local
```

## Production Deployment

### Vercel (league-web, front-office)

Each Vercel project needs its environment variables:

**Shared across all projects:**
- Add all root `.env.local` vars to **each** Vercel project
- Or use Vercel's "Link to existing project" feature

**App-specific:**
- Override `NEXT_PUBLIC_APP_URL` per deployment
- Set production Stripe keys only where needed

### Expo (chat)

```bash
# Set Expo-specific vars
npx expo env:set EXPO_PUBLIC_SUPABASE_URL=https://...
npx expo env:set EXPO_PUBLIC_API_URL=https://league-web.com/api
```

## Variable Naming Conventions

- `NEXT_PUBLIC_*` - Exposed to browser (Next.js apps)
- `EXPO_PUBLIC_*` - Exposed to app (Expo/React Native)
- No prefix - Server-side only (secrets)

## Security Best Practices

✅ **DO:**
- Keep `.env.local` files in `.gitignore` (already configured)
- Use different keys for dev/staging/production
- Store production secrets in deployment platform (Vercel, Expo)
- Document required variables in `.env.example`

❌ **DON'T:**
- Commit real `.env.local` files to git
- Share service role keys in client-side code
- Use production keys in development

## Troubleshooting

### "Environment variable not found"

1. Check if variable exists in root `.env.local`
2. Restart dev server (env vars loaded at startup)
3. Check variable naming (`NEXT_PUBLIC_` for client-side)

### App not inheriting root variables

- Next.js apps automatically read parent `.env.local`
- Make sure you're running from monorepo root: `pnpm dev`
- Not from app directory: ~~`cd apps/league-web && pnpm dev`~~

### Expo variables not working

- Expo needs `EXPO_PUBLIC_` prefix (not `NEXT_PUBLIC_`)
- Clear cache: `npx expo start --clear`

## References

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [Turborepo Environment Variables](https://turbo.build/repo/docs/handbook/environment-variables)
