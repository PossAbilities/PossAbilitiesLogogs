"use client";

import { useData } from "@/components/DataProvider";
import { GlassCard } from "@/components/GlassCard";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

export default function NewsPostPage() {
  const { news } = useData();
  const params = useParams();
  const id = params.id as string;

  const post = news.find((item) => item.id === id);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto w-full pt-8 pb-16 space-y-8 relative">
      {/* Background floating element to maintain depth */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-teal-300/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <Link
        href="/news"
        className="inline-flex items-center gap-2 text-teal-700 font-bold hover:text-teal-900 transition-colors bg-white/30 px-4 py-2 rounded-full border border-teal-200 backdrop-blur-md hover:bg-white/50"
      >
        <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">&larr;</span> Back to News
      </Link>

      <GlassCard className="p-0 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-white/40">
        {/* Massive Hero Glass Frame placeholder */}
        <div className="relative w-full h-64 md:h-96 bg-gradient-to-tr from-teal-600 to-teal-400 shadow-[inset_0_1px_4px_rgba(255,255,255,0.3)] border-b border-white/20 flex items-center justify-center overflow-hidden">
          <span className="text-white font-black tracking-widest text-4xl md:text-6xl uppercase drop-shadow-lg z-10">
            ADVOCACY
          </span>
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="p-8 md:p-12 bg-white/70 backdrop-blur-xl relative z-20">
          <div className="mb-10 text-center max-w-3xl mx-auto">
             <p className="text-teal-600 font-bold text-sm uppercase tracking-widest mb-4">
              {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 leading-tight">
              {post.title}
            </h1>
          </div>

          <div className="prose prose-lg md:prose-xl prose-slate max-w-2xl mx-auto">
            {/* Easy-Read Typography Enforcement */}
            <p className="font-sans text-xl leading-[1.8] text-slate-800 tracking-wide">
              {post.content}
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
