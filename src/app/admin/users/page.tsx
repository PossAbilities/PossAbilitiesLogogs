"use client";

import { GlassCard } from "@/components/GlassCard";
import { User } from "@/lib/data";
import { useData } from "@/components/DataProvider";

export default function AdminUsersPage() {
  const { users, setUsers } = useData();

  const handleDelete = (id: string) => {
    setUsers(users.filter(item => item.id !== id));
  };

  const handleAdd = () => {
    const newItem: User = {
      id: Date.now().toString(),
      name: "New User " + Date.now().toString().slice(-4),
      role: "user",
      dateOfBirth: new Date().toISOString()
    };
    setUsers([newItem, ...users]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
        <button onClick={handleAdd} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          + Add User
        </button>
      </div>

      <GlassCard className="p-0 overflow-hidden bg-white/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/50 border-b border-gray-200">
                <th className="p-4 font-bold">Name</th>
                <th className="p-4 font-bold">Role</th>
                <th className="p-4 font-bold">Date of Birth</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 last:border-0 hover:bg-white/40">
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-gray-600 capitalize">{user.role}</td>
                  <td className="p-4 text-gray-600">{new Date(user.dateOfBirth).toLocaleDateString()}</td>
                  <td className="p-4 text-right space-x-2">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
