#!/bin/bash
cat << 'INNER_EOF' > src/app/easy-reads/page.tsx
"use client";

import { GlassCard } from "@/components/GlassCard";
import { useData } from "@/components/DataProvider";
import { BookOpen } from "lucide-react";

export default function EasyReadsPage() {
  const { easyReads } = useData();

  // Filter out any items where showOnPortal is explicitly false
  const visibleEasyReads = easyReads.filter(item => item.showOnPortal !== false);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-green-900">Easy Reads</h1>
      <p className="easy-read-text font-bold text-gray-700 bg-white/50 p-4 rounded-xl inline-block">
        Simple information with big letters and pictures.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {visibleEasyReads.map((item) => (
          <GlassCard key={item.id} className="bg-green-50/40 border-green-200/50 flex flex-col h-full">
            {item.coverUrl ? (
              <div className="w-full aspect-video rounded-2xl mb-4 overflow-hidden border-b border-white/20 shadow-[inset_0_1px_4px_rgba(255,255,255,0.3)] bg-green-100/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
              </div>
            ) : (
              <div className="w-full aspect-video rounded-2xl mb-4 overflow-hidden border-b border-white/20 shadow-[inset_0_1px_4px_rgba(255,255,255,0.3)] bg-teal-500/80 flex items-center justify-center">
                 <BookOpen className="w-16 h-16 text-white opacity-80" />
              </div>
            )}

            <h2 className="text-3xl font-bold mb-4 text-green-800">{item.title}</h2>
            <div className="bg-white/60 p-6 rounded-2xl flex-grow">
              <p className="easy-read-text font-medium text-gray-800 leading-relaxed">
                {item.content}
              </p>
            </div>

            {item.fileUrl ? (
              <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-colors w-full text-lg text-center block">
                Read More
              </a>
            ) : (
              <button disabled className="mt-6 bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-colors w-full text-lg cursor-not-allowed">
                Document Unavailable
              </button>
            )}
          </GlassCard>
        ))}
        {visibleEasyReads.length === 0 && (
          <div className="col-span-1 md:col-span-2 py-12 text-center text-gray-500 font-medium text-xl bg-white/40 rounded-2xl">
             No easy read documents available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
INNER_EOF
