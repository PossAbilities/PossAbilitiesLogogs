import { GlassCard } from "@/components/GlassCard";
import { BirthdayBanner } from "@/components/BirthdayBanner";
import Link from "next/link";
import { mockNews, mockEvents } from "@/lib/data";

export default function Home() {
  return (
    <div className="pt-8">
      <BirthdayBanner />

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 auto-rows-min">

        {/* Large Feature Card: News (Spans 8 columns) */}
        <section aria-labelledby="news-heading" className="col-span-1 md:col-span-4 lg:col-span-8 flex">
          <GlassCard className="flex-1 flex flex-col justify-between bg-white/20 hover:bg-white/30 transition-colors duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-300/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div>
              <h2 id="news-heading" className="text-4xl font-black tracking-tighter mb-6 text-slate-800">Latest News</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {mockNews.slice(0, 2).map((item) => (
                  <article key={item.id} className="p-6 bg-white/20 rounded-2xl border border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all">
                    <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                    <p className="text-slate-700 easy-read-text line-clamp-3">{item.content}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="mt-8 relative z-10">
              <Link href="/news" className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold py-3 px-8 rounded-full hover:bg-teal-600 transition-colors focus-visible:outline-teal-500 shadow-lg shadow-slate-900/20">
                View all news <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </GlassCard>
        </section>

        {/* Tall Feature Card: Events (Spans 4 columns) */}
        <section aria-labelledby="events-heading" className="col-span-1 md:col-span-2 lg:col-span-4 flex">
          <GlassCard className="flex-1 flex flex-col bg-purple-900/10 border-purple-200/30 hover:bg-purple-900/20 transition-colors duration-500 relative overflow-hidden">
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
            <h2 id="events-heading" className="text-3xl font-black tracking-tighter mb-6 text-purple-900">Upcoming Events</h2>
            <div className="space-y-4 flex-1 relative z-10">
              {mockEvents.slice(0, 2).map((event) => (
                <div key={event.id} className="p-5 bg-white/20 rounded-2xl shadow-sm border border-white/30">
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{event.title}</h3>
                  <p className="font-semibold text-purple-800 mt-2 text-sm">{new Date(event.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })}</p>
                  <p className="text-slate-600 text-sm mt-1 flex items-center gap-1">
                    <span aria-hidden="true">📍</span> {event.location}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 relative z-10">
              <Link href="/events" className="block w-full text-center bg-white/20 hover:bg-white/40 text-purple-900 font-bold py-3 px-6 rounded-full transition-colors focus-visible:outline-purple-500 shadow-sm border border-white/30">
                All events
              </Link>
            </div>
          </GlassCard>
        </section>

        {/* Gamification Card (Spans 4 columns) */}
        <section aria-labelledby="progress-heading" className="col-span-1 md:col-span-2 lg:col-span-4 flex">
          <GlassCard className="flex-1 flex flex-col items-center justify-center text-center bg-slate-900/80 text-white border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <h2 id="progress-heading" className="sr-only">Your Progress</h2>
            <div className="relative w-40 h-40 flex items-center justify-center mb-4">
              {/* Neon glowing ring */}
              <div className="absolute inset-0 rounded-full border-4 border-teal-400/20 shadow-[0_0_30px_rgba(45,212,191,0.4)]"></div>
              <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-teal-400" strokeDasharray="283" strokeDashoffset="70" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-black tracking-tighter text-teal-300">75%</span>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-1">Goal</span>
              </div>
            </div>
            <p className="font-bold text-lg text-slate-200">You&apos;re doing great!</p>
            <p className="text-sm text-slate-400 mt-1">3 workshops completed</p>
          </GlassCard>
        </section>

        {/* Advocacy High-Gloss Blocks (Spans 4 columns) */}
        <section aria-labelledby="advocacy-heading" className="col-span-1 md:col-span-2 lg:col-span-4 flex">
           <div className="flex-1 glass-block p-8 flex flex-col justify-between group cursor-pointer hover:bg-white/70 transition-colors duration-300">
             <div>
                <div className="w-12 h-12 bg-pink-500 text-white rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform">
                  📢
                </div>
                <h2 id="advocacy-heading" className="text-2xl font-black tracking-tighter text-slate-900 mb-2">Speak Up!</h2>
                <p className="text-slate-700 font-medium leading-relaxed">Join our advocacy group and make your voice heard in the community.</p>
             </div>
             <div className="mt-6 flex items-center text-pink-600 font-bold">
               Get involved <span aria-hidden="true" className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
             </div>
           </div>
        </section>

        {/* Shout-out wall (Spans 4 columns) */}
        <section aria-labelledby="shoutout-heading" className="col-span-1 md:col-span-2 lg:col-span-4 flex">
          <GlassCard className="flex-1 bg-gradient-to-br from-teal-500/10 to-blue-500/10 border-teal-200/30 overflow-hidden relative">
            <h2 id="shoutout-heading" className="text-2xl font-black tracking-tighter text-teal-900 mb-6">Shout-Out Wall</h2>

            <div className="relative h-48 w-full">
              {/* Floating glass bubbles */}
              <div className="glass-bubble absolute top-2 left-4 p-3 flex items-center gap-3 animate-pulse hover:scale-105 transition-transform" style={{ animationDuration: '3s' }}>
                 <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center text-white font-bold text-sm">S</div>
                 <span className="font-bold text-sm text-slate-800 pr-2">Great job Sam!</span>
              </div>

              <div className="glass-bubble absolute top-20 right-2 p-3 flex items-center gap-3 animate-pulse hover:scale-105 transition-transform" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                 <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">A</div>
                 <span className="font-bold text-sm text-slate-800 pr-2">Thanks Alex ✨</span>
              </div>

              <div className="glass-bubble absolute bottom-4 left-10 p-3 flex items-center gap-3 animate-pulse hover:scale-105 transition-transform" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
                 <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold text-sm">J</div>
                 <span className="font-bold text-sm text-slate-800 pr-2">Happy bday! 🎉</span>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Quick Links Row (Spans 12 columns) */}
        <section aria-labelledby="quick-links-heading" className="col-span-1 md:col-span-4 lg:col-span-12">
          <GlassCard className="bg-white/10 border-white/30">
            <h2 id="quick-links-heading" className="sr-only">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               <Link href="/videos" className="flex items-center justify-center gap-4 p-6 bg-white/20 rounded-2xl hover:bg-white/30 transition-colors border border-white/30 group focus-visible:outline-teal-500 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                 <span className="text-3xl group-hover:scale-110 transition-transform drop-shadow-sm">📺</span>
                 <span className="text-xl font-bold text-slate-800">Watch Videos</span>
               </Link>
               <Link href="/easy-reads" className="flex items-center justify-center gap-4 p-6 bg-white/20 rounded-2xl hover:bg-white/30 transition-colors border border-white/30 group focus-visible:outline-teal-500 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                 <span className="text-3xl group-hover:scale-110 transition-transform drop-shadow-sm">📚</span>
                 <span className="text-xl font-bold text-slate-800">Easy Reads</span>
               </Link>
               <Link href="/workshops" className="flex items-center justify-center gap-4 p-6 bg-white/20 rounded-2xl hover:bg-white/30 transition-colors border border-white/30 group focus-visible:outline-teal-500 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                 <span className="text-3xl group-hover:scale-110 transition-transform drop-shadow-sm">🎨</span>
                 <span className="text-xl font-bold text-slate-800">Workshops</span>
               </Link>
            </div>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}
