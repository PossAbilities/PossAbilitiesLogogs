import { GlassCard } from "@/components/GlassCard";
import { BirthdayBanner } from "@/components/BirthdayBanner";
import Link from "next/link";
import { mockNews, mockEvents } from "@/lib/data";

export default function Home() {
  return (
    <>
      <BirthdayBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <section aria-labelledby="news-heading" className="col-span-1 md:col-span-2 lg:col-span-2">
          <GlassCard className="h-full">
            <h2 id="news-heading" className="text-3xl font-bold mb-6 text-blue-800">Latest News</h2>
            <div className="space-y-6">
              {mockNews.slice(0, 2).map((item) => (
                <article key={item.id} className="p-4 bg-white/40 rounded-xl border border-white/20 hover:bg-white/50 transition-colors">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-800 easy-read-text">{item.content}</p>
                </article>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/news" className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition-colors focus-visible:outline-blue-800 text-lg">
                View all news
              </Link>
            </div>
          </GlassCard>
        </section>

        <section aria-labelledby="events-heading">
          <GlassCard className="h-full bg-orange-100/40">
            <h2 id="events-heading" className="text-3xl font-bold mb-6 text-orange-800">Upcoming Events</h2>
            <div className="space-y-4">
              {mockEvents.slice(0, 2).map((event) => (
                <div key={event.id} className="p-4 bg-white/50 rounded-xl">
                  <h3 className="text-xl font-bold">{event.title}</h3>
                  <p className="font-semibold text-orange-900 mt-1">{new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                  <p className="text-gray-800">{event.location}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/events" className="inline-block bg-orange-500 text-white font-bold py-3 px-6 rounded-full hover:bg-orange-600 transition-colors focus-visible:outline-orange-800 text-lg">
                All events
              </Link>
            </div>
          </GlassCard>
        </section>

        <section aria-labelledby="quick-links-heading" className="col-span-1 md:col-span-2 lg:col-span-3">
          <GlassCard>
            <h2 id="quick-links-heading" className="text-3xl font-bold mb-6 text-purple-800">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               <Link href="/videos" className="block p-8 bg-purple-100/50 rounded-2xl hover:bg-purple-200/50 transition-colors text-center border border-purple-200/50 group focus-visible:outline-purple-500">
                 <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">📺</span>
                 <span className="text-2xl font-bold text-purple-900">Watch Videos</span>
               </Link>
               <Link href="/easy-reads" className="block p-8 bg-green-100/50 rounded-2xl hover:bg-green-200/50 transition-colors text-center border border-green-200/50 group focus-visible:outline-green-500">
                 <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">📚</span>
                 <span className="text-2xl font-bold text-green-900">Easy Reads</span>
               </Link>
               <Link href="/workshops" className="block p-8 bg-pink-100/50 rounded-2xl hover:bg-pink-200/50 transition-colors text-center border border-pink-200/50 group focus-visible:outline-pink-500">
                 <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">🎨</span>
                 <span className="text-2xl font-bold text-pink-900">Workshops</span>
               </Link>
            </div>
          </GlassCard>
        </section>
      </div>
    </>
  );
}
