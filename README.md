# WashOpsV

## Toolchain

- Node.js 20 (engines: >=18.18)
- pnpm 10 (packageManager: pnpm@10)

## Setup

1. Enable pnpm via Corepack (Node 18.18+ / 20):
   
   ```bash
   corepack enable
   corepack prepare pnpm@10 --activate
   pnpm -v
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Common scripts:

   ```bash
   pnpm dev        # Next.js dev server
   pnpm build      # Production build
   pnpm start      # Start production server
   pnpm lint       # ESLint
   pnpm typecheck  # TypeScript noEmit
   pnpm test       # Vitest
   ```

## CI/CD

- GitHub Actions is configured in `.github/workflows/ci.yml` to use pnpm and Node 20 with caching.
- Vercel is configured via `vercel.json` and will auto-detect Next.js.
