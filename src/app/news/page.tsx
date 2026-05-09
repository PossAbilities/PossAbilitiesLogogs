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
                <div className="mt-auto">
                  <Link
                    href={`/news/${news.id}`}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors focus-visible:outline-blue-500 shadow-md group"
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
