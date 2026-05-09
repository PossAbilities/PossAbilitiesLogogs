import { GlassCard } from "@/components/GlassCard";
import { mockWorkshops } from "@/lib/data";

export default function WorkshopsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-pink-900">Workshops</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {mockWorkshops.map((workshop) => (
          <GlassCard key={workshop.id} className="bg-pink-50/40">
            <div className="flex items-start gap-4">
              <div className="text-5xl p-4 bg-white/60 rounded-2xl">🎨</div>
              <div>
                <h2 className="text-2xl font-bold mb-2 text-pink-900">{workshop.title}</h2>
                <p className="easy-read-text text-gray-800 mb-4">{workshop.description}</p>
                <div className="flex gap-4">
                  <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-xl transition-colors">
                    Download Materials
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
