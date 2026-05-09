"use client";

import { GlassCard } from "@/components/GlassCard";
import { useData } from "@/components/DataProvider";

export default function EventsPage() {
  const { events } = useData();

  return (
    <div className="space-y-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-orange-900">Upcoming Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <GlassCard key={event.id} className="bg-orange-50/40 hover:bg-orange-50/60 transition-colors">
            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
            <div className="bg-white/60 rounded-lg p-4 mb-4 border border-orange-100">
              <p className="text-xl font-bold text-orange-800 flex items-center gap-2">
                <span>📅</span> {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <p className="text-lg font-bold text-gray-700 flex items-center gap-2 mt-2">
                <span>⏰</span> {new Date(event.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-lg font-bold text-gray-700 flex items-center gap-2 mt-2">
                <span>📍</span> {event.location}
              </p>
            </div>
            <p className="easy-read-text text-gray-800">{event.description}</p>
            <button className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold py-3 px-6 rounded-xl transition-colors focus-visible:outline-orange-700">
              I want to go!
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
