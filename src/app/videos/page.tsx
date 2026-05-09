"use client";

import { GlassCard } from "@/components/GlassCard";
import { useData } from "@/components/DataProvider";

export default function VideosPage() {
  const { videos } = useData();

  return (
    <div className="space-y-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-purple-900">Video Library</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <GlassCard key={video.id} className="p-4 bg-purple-50/40">
            <div className="aspect-video bg-gray-200 rounded-xl mb-4 flex items-center justify-center border-2 border-purple-200">
              {/* Placeholder for video player/thumbnail */}
              <span className="text-6xl">▶️</span>
            </div>
            <h2 className="text-xl font-bold mb-2">{video.title}</h2>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl transition-colors mt-2">
              Watch Video
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
