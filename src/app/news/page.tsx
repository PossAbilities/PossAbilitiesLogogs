"use client";

import { useData } from "@/components/DataProvider";
import Link from "next/link";

export default function NewsPage() {
  const { news } = useData();

  return (
    <div className="space-y-8 pt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-800">News Archive</h1>
      </div>

      {/* Bento Grid Layout for News Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <article key={item.id} className="group/card bg-white/20 rounded-2xl border border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all flex flex-col overflow-hidden">
            {/* Glass-Frame Image Thumbnail */}
            <div className="relative w-full aspect-video bg-teal-500 rounded-t-2xl shadow-[inset_0_1px_4px_rgba(255,255,255,0.3)] border-b border-white/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-600 to-teal-400 group-hover/card:brightness-110 group-hover/card:scale-105 transition-all duration-500 ease-out"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-black tracking-widest text-xl uppercase drop-shadow-md z-10">
                  ADVOCACY
                </span>
              </div>
            </div>
            {/* Card Content */}
            <div className="p-6 flex-1 flex flex-col backdrop-blur-sm">
               <p className="text-sm font-bold text-teal-600 mb-2 uppercase tracking-wider">
                  {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
               </p>
              <h2 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h2>
              <p className="text-slate-700 easy-read-text line-clamp-3 mb-4 flex-1">{item.content}</p>
              <div className="mt-auto flex justify-end">
                <Link
                  href={`/news/${item.id}`}
                  className="inline-flex items-center gap-1 text-slate-400 text-sm hover:text-slate-600 transition-colors group/link"
                >
                  Read more <span aria-hidden="true" className="group-hover/link:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
