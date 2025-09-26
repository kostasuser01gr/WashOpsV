import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="glass rounded-2xl p-10 text-center max-w-xl w-full">
        <h1 className="text-4xl font-semibold tracking-tight">WashOpsV</h1>
        <p className="mt-3 text-muted-foreground">Premium operations for modern wash stations.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="#"
            className="rounded-xl bg-[hsl(var(--primary))] px-5 py-2 text-[hsl(var(--primary-foreground))] shadow-glow"
          >
            Dashboard
          </Link>
          <Link href="#" className="rounded-xl border border-[hsl(var(--border))] px-5 py-2">
            Learn more
          </Link>
        </div>
      </div>
    </main>
  );
}
