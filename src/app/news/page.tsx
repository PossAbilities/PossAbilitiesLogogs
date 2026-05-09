"use client";

import { GlassCard } from "@/components/GlassCard";
import { useData } from "@/components/DataProvider";
import Link from "next/link";

export default function NewsPage() {
  const { news } = useData();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900">Latest News</h1>
      </div>

      <div className="grid gap-6">
        {news.map((news) => (
          <GlassCard key={news.id} as="article">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 flex flex-col">
                <p className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wider">
                  {new Date(news.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{news.title}</h2>
                <p className="easy-read-text text-gray-800 mb-6">{news.content}</p>
                <div className="mt-auto flex justify-end">
                  <Link
                    href={`/news/${news.id}`}
                    className="inline-flex items-center gap-1 text-slate-400 text-sm hover:text-slate-600 transition-colors group"
                  >
                    Read more <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
