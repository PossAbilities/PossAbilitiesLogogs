"use client";

import { useData } from "@/components/DataProvider";
import { GlassCard } from "@/components/GlassCard";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";

export default function NewsPostPage() {
  const { news } = useData();
  const params = useParams();
  const id = params.id as string;

  const post = news.find((item) => item.id === id);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto w-full pt-8 space-y-8">
      <Link
        href="/news"
        className="inline-flex items-center gap-2 text-teal-700 font-bold hover:text-teal-900 transition-colors bg-white/30 px-4 py-2 rounded-full border border-teal-200 backdrop-blur-md"
      >
        <span aria-hidden="true">&larr;</span> Back to News
      </Link>

      <GlassCard className="p-0 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-white/40">
        {post.imageUrl && (
          <div className="relative w-full h-64 md:h-96">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="absolute inset-0 w-full h-full object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
            />
            {/* Dark gradient overlay for text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

            <div className="absolute bottom-0 left-0 p-6 md:p-10 z-10 w-full">
              <p className="text-teal-300 font-bold text-sm uppercase tracking-widest mb-3 drop-shadow-md">
                {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white drop-shadow-lg leading-tight">
                {post.title}
              </h1>
            </div>
          </div>
        )}

        <div className="p-6 md:p-10 bg-white/80 backdrop-blur-xl">
          {!post.imageUrl && (
            <div className="mb-8">
               <p className="text-teal-600 font-bold text-sm uppercase tracking-widest mb-2">
                {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-tight">
                {post.title}
              </h1>
            </div>
          )}

          <div className="prose prose-lg md:prose-xl prose-slate max-w-none easy-read-text text-slate-800 leading-relaxed">
            <p>{post.content}</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
