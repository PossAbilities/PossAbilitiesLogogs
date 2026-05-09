import { GlassCard } from "@/components/GlassCard";
import { mockEasyReads } from "@/lib/data";

export default function EasyReadsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-green-900">Easy Reads</h1>
      <p className="easy-read-text font-bold text-gray-700 bg-white/50 p-4 rounded-xl inline-block">
        Simple information with big letters and pictures.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mockEasyReads.map((item) => (
          <GlassCard key={item.id} className="bg-green-50/40 border-green-200/50">
            <h2 className="text-3xl font-bold mb-4 text-green-800">{item.title}</h2>
            <div className="bg-white/60 p-6 rounded-2xl">
              <p className="easy-read-text font-medium text-gray-800 leading-relaxed">
                {item.content}
              </p>
            </div>
            <button className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-colors w-full text-lg">
              Read More
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
