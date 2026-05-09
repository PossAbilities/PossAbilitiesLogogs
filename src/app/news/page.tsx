import { GlassCard } from "@/components/GlassCard";
import { mockNews } from "@/lib/data";

export default function NewsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900">Latest News</h1>
      </div>

      <div className="grid gap-6">
        {mockNews.map((news) => (
          <GlassCard key={news.id} as="article">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <p className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wider">
                  {new Date(news.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{news.title}</h2>
                <p className="easy-read-text text-gray-800">{news.content}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
