import { GlassCard } from "@/components/GlassCard";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="bg-blue-50/50">
          <h2 className="text-xl font-bold mb-2">News Posts</h2>
          <p className="text-4xl font-bold text-blue-600 mb-4">2</p>
          <Link href="/admin/news" className="text-blue-700 hover:underline">Manage News →</Link>
        </GlassCard>

        <GlassCard className="bg-orange-50/50">
          <h2 className="text-xl font-bold mb-2">Events</h2>
          <p className="text-4xl font-bold text-orange-600 mb-4">2</p>
          <Link href="/admin/events" className="text-orange-700 hover:underline">Manage Events →</Link>
        </GlassCard>

        <GlassCard className="bg-purple-50/50">
          <h2 className="text-xl font-bold mb-2">Users</h2>
          <p className="text-4xl font-bold text-purple-600 mb-4">2</p>
          <Link href="/admin/users" className="text-purple-700 hover:underline">Manage Users →</Link>
        </GlassCard>
      </div>
    </div>
  );
}
