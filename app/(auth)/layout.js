import Link from "next/link";
import { Compass } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-control bg-ops-600 text-white">
          <Compass className="h-[18px] w-[18px]" strokeWidth={2} />
        </div>
        <span className="font-display text-[15px] font-semibold text-ink">
          LifeOps AI
        </span>
      </Link>
      <div className="w-full max-w-sm rounded-card border border-surface-border bg-white p-7 shadow-card">
        {children}
      </div>
    </div>
  );
}
