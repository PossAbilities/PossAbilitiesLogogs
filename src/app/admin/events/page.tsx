"use client";

import { GlassCard } from "@/components/GlassCard";
import { useData } from "@/components/DataProvider";

export default function AdminEventsPage() {
  const { events, setEvents } = useData();

  const handleDelete = (id: string) => {
    setEvents(events.filter(item => item.id !== id));
  };

  const handleAdd = () => {
    const newItem = {
      id: Date.now().toString(),
      title: "New Event " + Date.now().toString().slice(-4),
      description: "This is a newly added event.",
      location: "TBD",
      date: new Date().toISOString()
    };
    setEvents([newItem, ...events]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
        <button onClick={handleAdd} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          + Add Event
        </button>
      </div>

      <GlassCard className="p-0 overflow-hidden bg-white/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/50 border-b border-gray-200">
                <th className="p-4 font-bold">Title</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Location</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-gray-100 last:border-0 hover:bg-white/40">
                  <td className="p-4 font-medium">{event.title}</td>
                  <td className="p-4 text-gray-600">{new Date(event.date).toLocaleDateString()}</td>
                  <td className="p-4 text-gray-600">{event.location}</td>
                  <td className="p-4 text-right space-x-2">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:underline">Delete</button>
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
