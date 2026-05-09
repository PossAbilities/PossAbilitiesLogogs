"use client";

import { GlassCard } from "@/components/GlassCard";
import { useData } from "@/components/DataProvider";

export default function AdminNewsPage() {
  const { news, setNews } = useData();

  const handleDelete = (id: string) => {
    setNews(news.filter(item => item.id !== id));
  };

  const handleAdd = () => {
    const newItem = {
      id: Date.now().toString(),
      title: "New Article " + Date.now().toString().slice(-4),
      content: "This is a newly added article.",
      date: new Date().toISOString()
    };
    setNews([newItem, ...news]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manage News</h1>
        <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          + Add News
        </button>
      </div>

      <GlassCard className="p-0 overflow-hidden bg-white/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/50 border-b border-gray-200">
                <th className="p-4 font-bold">Title</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-white/40">
                  <td className="p-4 font-medium">{item.title}</td>
                  <td className="p-4 text-gray-600">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="p-4 text-right space-x-2">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">Delete</button>
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
