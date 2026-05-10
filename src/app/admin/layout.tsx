import { GlassCard } from "@/components/GlassCard";
import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 shrink-0">
        <GlassCard className="p-4 bg-gray-50/80 sticky top-24">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Admin Menu</h2>
          <nav>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/admin" className="block p-2 rounded-lg hover:bg-gray-200/50 transition-colors focus-visible:outline-gray-500">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/news" className="block p-2 rounded-lg hover:bg-gray-200/50 transition-colors focus-visible:outline-gray-500">
                  Manage News
                </Link>
              </li>
              <li>
                <Link href="/admin/events" className="block p-2 rounded-lg hover:bg-gray-200/50 transition-colors focus-visible:outline-gray-500">
                  Manage Events
                </Link>
              </li>
              <li>
                <Link href="/admin/easy-reads" className="block p-2 rounded-lg hover:bg-gray-200/50 transition-colors focus-visible:outline-gray-500">
                  Easy Read Creator
                </Link>
              </li>
              <li>
                <Link href="/admin/users" className="block p-2 rounded-lg hover:bg-gray-200/50 transition-colors focus-visible:outline-gray-500">
                  Manage Users
                </Link>
              </li>
            </ul>
          </nav>
        </GlassCard>
      </aside>
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
