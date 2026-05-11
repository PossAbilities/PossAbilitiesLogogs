"use client";

import { GlassCard } from "@/components/GlassCard";
import { useData } from "@/components/DataProvider";

export default function EventsPage() {
  const { events } = useData();

  return (
    <div className="space-y-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-orange-900">Upcoming Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {events.map((event) => (
          <GlassCard key={event.id} className="p-0 overflow-hidden flex flex-col bg-white/40 border-white/40 hover:bg-white/50 transition-colors group relative">

            {/* Top Half: Glassmorphic Thumbnail with Floating Date */}
            <div className="relative aspect-[16/10] bg-[#E8F3FA] overflow-hidden flex-shrink-0 border-b border-[#A7C0D8]/30">
              {event.imageUrl ? (
                <img src={event.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[#00CFB4] font-black tracking-widest text-3xl opacity-30 uppercase">
                    ADVOCACY
                  </span>
                </div>
              )}

              {/* Overlapping Date Badge */}
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/50 flex flex-col items-center">
                <span className="text-[#E74C3C] font-bold text-sm uppercase leading-none">
                  {new Date(event.date).toLocaleDateString('en-GB', { month: 'short' })}
                </span>
                <span className="text-[#0B2136] font-black text-2xl leading-none mt-1">
                  {new Date(event.date).getDate()}
                </span>
              </div>
            </div>

            {/* Bottom Half: Content */}
            <div className="p-6 flex-1 flex flex-col">
              <h2 className="text-2xl font-bold mb-3 text-[#0B2136] group-hover:text-[#00CFB4] transition-colors">{event.title}</h2>

              <div className="space-y-2 mb-4">
                <p className="text-[#4B708B] font-medium flex items-center gap-2">
                  <span className="text-[#00CFB4]">⏰</span> {new Date(event.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-[#4B708B] font-medium flex items-center gap-2">
                  <span className="text-[#00CFB4]">📍</span> {event.location}
                </p>
              </div>

              <p className="easy-read-text text-[#2C3E50] mb-6 flex-1 line-clamp-3">{event.description}</p>

              <button className="w-full bg-[#00CFB4] hover:bg-[#00B39B] text-white text-lg font-bold py-3 px-6 rounded-xl transition-colors focus-visible:outline-[#00CFB4] shadow-sm">
                I want to go!
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
