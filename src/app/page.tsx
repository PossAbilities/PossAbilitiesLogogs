"use client";

import { useData } from "@/components/DataProvider";
import { GlassCard } from "@/components/GlassCard";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const { news, events } = useData();
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [mood, setMood] = useState<string | null>(null);
  const [showShoutoutModal, setShowShoutoutModal] = useState(false);
  const [shoutoutName, setShoutoutName] = useState("");
  const [shoutoutMessage, setShoutoutMessage] = useState("");
  const [shoutouts, setShoutouts] = useState([
    { id: 1, initial: 'S', color: 'bg-pink-400', message: 'Great job Sam!', delay: '0s', duration: '3s', top: 'top-2', left: 'left-4' },
    { id: 2, initial: 'A', color: 'bg-blue-500', message: 'Thanks Alex ✨', delay: '1s', duration: '4s', top: 'top-20', left: 'auto', right: 'right-2' },
    { id: 3, initial: 'J', color: 'bg-orange-400', message: 'Happy bday! 🎉', delay: '0.5s', duration: '3.5s', top: 'auto', bottom: 'bottom-4', left: 'left-10' }
  ]);

  // Voice synthesis
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMoodSelect = (selectedMood: string) => {
    setMood(selectedMood);
    speakText(`You are feeling ${selectedMood}. Thanks for letting us know!`);
  };

  const handleShoutoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shoutoutName && shoutoutMessage) {
      const newShoutout = {
        id: Date.now(),
        initial: shoutoutName.charAt(0).toUpperCase(),
        color: 'bg-purple-500',
        message: shoutoutMessage,
        delay: '0s',
        duration: '3s',
        top: `${Math.floor(Math.random() * 60) + 10}%`,
        left: `${Math.floor(Math.random() * 60) + 10}%`,
      };
      setShoutouts([...shoutouts, newShoutout as unknown as typeof shoutouts[0]]);
      setShowShoutoutModal(false);
      setShoutoutName("");
      setShoutoutMessage("");
      speakText("Your shout-out has been posted!");
    }
  };

  return (
    <div className={`space-y-8 relative ${highContrast ? 'contrast-125 saturate-150' : ''}`} style={{ fontSize: `${fontSizeMultiplier}rem` }}>
      {/* Floating Accessibility Menu */}
      <div className="fixed right-4 top-24 z-50 flex flex-col gap-2">
        <button
          onClick={() => setFontSizeMultiplier(prev => Math.min(prev + 0.1, 1.5))}
          className="w-12 h-12 bg-white/90 backdrop-blur border border-slate-200 rounded-full flex items-center justify-center text-xl font-bold shadow-lg hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-[#00CFB4] outline-none"
          aria-label="Increase text size"
        >
          A+
        </button>
        <button
          onClick={() => setFontSizeMultiplier(prev => Math.max(prev - 0.1, 0.8))}
          className="w-12 h-12 bg-white/90 backdrop-blur border border-slate-200 rounded-full flex items-center justify-center text-xl font-bold shadow-lg hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-[#00CFB4] outline-none"
          aria-label="Decrease text size"
        >
          A-
        </button>
        <button
          onClick={() => setHighContrast(!highContrast)}
          className="w-12 h-12 bg-black/90 text-white backdrop-blur border border-slate-700 rounded-full flex items-center justify-center text-xl font-bold shadow-lg hover:bg-black transition-colors focus:ring-2 focus:ring-[#00CFB4] outline-none"
          aria-label="Toggle high contrast"
        >
          🌗
        </button>
      </div>

      <div className="text-center py-6 md:py-10">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[#0B2136] mb-4">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00CFB4] to-[#009985]">PossAbilities</span>
        </h1>
        <p className="text-xl md:text-2xl text-[#4B708B] font-medium easy-read-text max-w-2xl mx-auto">
          Your portal for news, events, learning, and community.
        </p>
      </div>

      {/* Mood Tracker */}
      <section className="mb-12">
        <GlassCard className="bg-white/60 border-white/40 text-center py-8">
          <h2 className="text-2xl font-bold text-[#0B2136] mb-6 flex items-center justify-center gap-2">
            How are you feeling today?
            <button onClick={() => speakText("How are you feeling today?")} className="text-[#00CFB4] hover:scale-110 transition-transform p-2 rounded-full hover:bg-[#E8F3FA]" aria-label="Read out loud">
               🔊
            </button>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
             {[
               { emoji: '😊', label: 'Happy' },
               { emoji: '😎', label: 'Cool' },
               { emoji: '😴', label: 'Tired' },
               { emoji: '😟', label: 'Sad' },
               { emoji: '🤔', label: 'Thinking' }
             ].map(m => (
               <button
                 key={m.label}
                 onClick={() => handleMoodSelect(m.label)}
                 className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ${mood === m.label ? 'bg-[#00CFB4]/20 border-2 border-[#00CFB4] scale-110 shadow-lg' : 'bg-white border border-slate-200 hover:bg-slate-50 hover:scale-105'}`}
               >
                 <span className="text-4xl mb-2">{m.emoji}</span>
                 <span className="font-bold text-[#0B2136]">{m.label}</span>
               </button>
             ))}
          </div>
          {mood && (
            <p className="mt-6 text-lg font-bold text-[#00CFB4] animate-fade-in">
              Thanks for sharing! We hope you have a great day.
            </p>
          )}
        </GlassCard>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 auto-rows-min">

        {/* Large Feature Card: Latest News (Spans 8 columns) */}
        <section aria-labelledby="news-heading" className="col-span-1 md:col-span-2 lg:col-span-8 flex">
          <GlassCard className="flex-1 flex flex-col bg-gradient-to-br from-[#E8F3FA] to-white border-white/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00CFB4]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h2 id="news-heading" className="text-3xl font-black tracking-tighter text-[#0B2136] flex items-center gap-2">
                Latest News
                <button onClick={() => speakText("Latest News")} className="text-[#00CFB4] hover:scale-110 transition-transform p-2 rounded-full hover:bg-white" aria-label="Read out loud">🔊</button>
              </h2>
            </div>
            <div className="flex-1 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {news.slice(0, 2).map((item) => (
                  <article key={item.id} className="bg-white/80 rounded-2xl p-0 border border-white/50 hover:bg-white transition-colors duration-300 shadow-sm flex flex-col overflow-hidden group">
                    {/* The Premium Thumbnail */}
                    <div className="relative w-full aspect-[16/10] bg-[#E8F3FA] border-b border-[#A7C0D8]/30 flex items-center justify-center overflow-hidden">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-tr from-teal-600 to-teal-400"></div>
                      )}
                      {!item.imageUrl && (
                        <span className="text-white font-black tracking-widest text-xl uppercase drop-shadow-md z-10 opacity-50">
                          NEWS
                        </span>
                      )}
                    </div>
                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-3 text-[#0B2136] group-hover:text-[#00CFB4] transition-colors">{item.title}</h3>
                      <p className="text-[#4B708B] easy-read-text line-clamp-3 mb-4 flex-1">{item.content}</p>
                      <div className="mt-auto flex justify-between items-center">
                        <button
                          onClick={(e) => { e.preventDefault(); speakText(item.title + ". " + item.content); }}
                          className="text-[#00CFB4] p-2 hover:bg-[#E8F3FA] rounded-full transition-colors"
                          aria-label={`Read ${item.title} out loud`}
                        >
                          🔊 Listen
                        </button>
                        <Link
                          href={`/news/${item.id}`}
                          className="inline-flex items-center gap-1 text-[#4B708B] font-bold text-sm hover:text-[#0B2136] transition-colors group/link"
                        >
                          Read more <span aria-hidden="true" className="group-hover/link:translate-x-1 transition-transform">&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="mt-8 relative z-10">
              <Link href="/news" className="inline-flex items-center gap-2 bg-[#0B2136] text-white font-bold py-3 px-8 rounded-full hover:bg-[#00CFB4] transition-colors focus-visible:outline-[#00CFB4] shadow-md">
                View all news <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </GlassCard>
        </section>

        {/* Tall Feature Card: Events (Spans 4 columns) */}
        <section aria-labelledby="events-heading" className="col-span-1 md:col-span-2 lg:col-span-4 flex">
          <GlassCard className="flex-1 flex flex-col bg-gradient-to-br from-[#FDF2F8] to-white border-[#FBCFE8]/50 hover:border-[#F9A8D4] transition-colors duration-500 relative overflow-hidden">
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FCE7F3] rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
            <h2 id="events-heading" className="text-3xl font-black tracking-tighter mb-6 text-[#831843] flex items-center gap-2">
              Upcoming Events
              <button onClick={() => speakText("Upcoming Events")} className="text-[#DB2777] hover:scale-110 transition-transform p-2 rounded-full hover:bg-white" aria-label="Read out loud">🔊</button>
            </h2>
            <div className="space-y-6 flex-1 relative z-10">
              {events.slice(0, 2).map((event) => (
                <div key={event.id} className="bg-white/80 rounded-2xl shadow-sm border border-[#FBCFE8] overflow-hidden group">
                  {/* Event Thumbnail */}
                  <div className="relative aspect-[16/10] bg-[#FCE7F3] overflow-hidden border-b border-[#FBCFE8]">
                    {event.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={event.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[#DB2777] font-black tracking-widest text-2xl opacity-20 uppercase">ADVOCACY</span>
                      </div>
                    )}

                    {/* Overlapping Date Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-white/50 flex flex-col items-center">
                      <span className="text-[#DB2777] font-bold text-xs uppercase leading-none">
                        {new Date(event.date).toLocaleDateString('en-GB', { month: 'short' })}
                      </span>
                      <span className="text-[#831843] font-black text-xl leading-none mt-0.5">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-[#831843] leading-tight group-hover:text-[#DB2777] transition-colors">{event.title}</h3>
                    <p className="text-[#9D174D] text-sm mt-2 flex items-center gap-1 font-medium">
                      <span aria-hidden="true">⏰</span> {new Date(event.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-[#9D174D] text-sm mt-1 flex items-center gap-1 font-medium">
                      <span aria-hidden="true">📍</span> {event.location}
                    </p>
                    <button
                      onClick={(e) => { e.preventDefault(); speakText(`${event.title} on ${new Date(event.date).toLocaleDateString()} at ${event.location}`); }}
                      className="mt-3 text-[#DB2777] text-sm hover:underline flex items-center gap-1 font-bold"
                    >
                      🔊 Listen to details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 relative z-10">
              <Link href="/events" className="block w-full text-center bg-white/50 hover:bg-white text-[#9D174D] font-bold py-3 px-6 rounded-xl transition-colors focus-visible:outline-[#DB2777] shadow-sm border border-[#FBCFE8]">
                All events
              </Link>
            </div>
          </GlassCard>
        </section>

        {/* Gamification Card (Spans 4 columns) */}
        <section aria-labelledby="progress-heading" className="col-span-1 md:col-span-2 lg:col-span-4 flex">
          <GlassCard className="flex-1 flex flex-col items-center justify-center text-center bg-[#0B2136] text-white border-white/10 shadow-lg">
            <h2 id="progress-heading" className="sr-only">Your Progress</h2>
            <div className="relative w-40 h-40 flex items-center justify-center mb-4">
              {/* Glowing ring */}
              <div className="absolute inset-0 rounded-full border-4 border-[#00CFB4]/20 shadow-[0_0_20px_rgba(0,207,180,0.2)]"></div>
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-[#00CFB4]" strokeDasharray="283" strokeDashoffset="70" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-black tracking-tighter text-white">75%</span>
                <span className="text-xs font-bold text-[#00CFB4] uppercase tracking-widest mt-1">Goal</span>
              </div>
            </div>
            <p className="font-bold text-lg text-white flex items-center gap-2">
              You&apos;re doing great!
              <button onClick={() => speakText("You're doing great! 75% of your goal completed. 3 workshops completed.")} className="text-[#00CFB4] hover:scale-110 transition-transform p-1 rounded-full" aria-label="Read out loud">🔊</button>
            </p>
            <p className="text-sm text-slate-300 mt-1">3 workshops completed</p>
          </GlassCard>
        </section>

        {/* Advocacy High-Gloss Blocks (Spans 4 columns) */}
        <section aria-labelledby="advocacy-heading" className="col-span-1 md:col-span-2 lg:col-span-4 flex">
           <div className="flex-1 glass-block bg-gradient-to-br from-purple-50 to-white p-8 flex flex-col justify-between group cursor-pointer hover:border-purple-200 transition-colors duration-300 border border-slate-200/60 rounded-3xl shadow-sm">
             <div>
                <div className="w-14 h-14 bg-purple-500 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                  📢
                </div>
                <h2 id="advocacy-heading" className="text-2xl font-black tracking-tighter text-[#0B2136] mb-3 flex items-center gap-2">
                  Speak Up!
                  <button onClick={(e) => { e.stopPropagation(); speakText("Speak Up! Join our advocacy group and make your voice heard in the community."); }} className="text-purple-500 hover:scale-110 transition-transform p-1 rounded-full bg-purple-50" aria-label="Read out loud">🔊</button>
                </h2>
                <p className="text-[#4B708B] font-medium leading-relaxed">Join our advocacy group and make your voice heard in the community.</p>
             </div>
             <div className="mt-8 flex items-center text-purple-600 font-bold bg-purple-50 w-max px-4 py-2 rounded-lg group-hover:bg-purple-100 transition-colors">
               Get involved <span aria-hidden="true" className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
             </div>
           </div>
        </section>

        {/* Shout-out wall (Spans 4 columns) */}
        <section aria-labelledby="shoutout-heading" className="col-span-1 md:col-span-2 lg:col-span-4 flex">
          <GlassCard className="flex-1 bg-gradient-to-br from-[#FFFBEB] to-white border-[#FDE68A]/50 overflow-hidden relative">
            <div className="flex justify-between items-start mb-6">
              <h2 id="shoutout-heading" className="text-2xl font-black tracking-tighter text-[#92400E] flex items-center gap-2">
                Shout-Out Wall
                <button onClick={() => speakText("Shout-out wall. People are saying great things!")} className="text-[#D97706] hover:scale-110 transition-transform p-1 rounded-full" aria-label="Read out loud">🔊</button>
              </h2>
              <button
                onClick={() => setShowShoutoutModal(true)}
                className="bg-[#F59E0B] hover:bg-[#D97706] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-colors shadow-sm focus-visible:outline-[#D97706]"
                aria-label="Add a shout-out"
              >
                +
              </button>
            </div>

            <div className="relative h-48 w-full">
              {shoutouts.map((shoutout) => (
                <div
                  key={shoutout.id}
                  className="absolute p-3 flex items-center gap-3 animate-pulse hover:scale-105 transition-transform bg-white/80 backdrop-blur-sm border border-white rounded-2xl shadow-sm cursor-pointer"
                  style={{
                    animationDuration: shoutout.duration,
                    animationDelay: shoutout.delay,
                    top: shoutout.top,
                    left: shoutout.left,
                    right: shoutout.right,
                    bottom: shoutout.bottom
                  }}
                  onClick={() => speakText(`${shoutout.initial} says ${shoutout.message}`)}
                >
                   <div className={`w-8 h-8 rounded-full ${shoutout.color} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                     {shoutout.initial}
                   </div>
                   <span className="font-bold text-sm text-[#0B2136] pr-2">{shoutout.message}</span>
                </div>
              ))}
            </div>

            {/* Modal */}
            {showShoutoutModal && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 p-6 flex flex-col justify-center animate-fade-in rounded-3xl border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-xl text-[#0B2136]">New Shout-out</h3>
                  <button onClick={() => setShowShoutoutModal(false)} className="text-slate-400 hover:text-slate-600 font-bold p-2 text-xl">&times;</button>
                </div>
                <form onSubmit={handleShoutoutSubmit} className="space-y-4">
                  <input
                    required
                    placeholder="Your Name"
                    value={shoutoutName}
                    onChange={(e) => setShoutoutName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  />
                  <input
                    required
                    placeholder="Message (e.g. Great job Sam!)"
                    value={shoutoutMessage}
                    onChange={(e) => setShoutoutMessage(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  />
                  <button type="submit" className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold py-3 rounded-xl transition-colors">
                    Post!
                  </button>
                </form>
              </div>
            )}
          </GlassCard>
        </section>

        {/* Quick Links Row (Spans 12 columns) */}
        <section aria-labelledby="quick-links-heading" className="col-span-1 md:col-span-4 lg:col-span-12">
          <GlassCard className="bg-white/80 border-white/50 py-8">
            <div className="flex items-center gap-4 mb-6 justify-center">
              <h2 id="quick-links-heading" className="text-2xl font-bold text-[#0B2136] text-center">Explore More</h2>
              <button onClick={() => speakText("Explore More: Videos, Easy Reads, Workshops")} className="text-[#00CFB4] hover:scale-110 transition-transform p-2 rounded-full bg-[#E8F3FA]" aria-label="Read out loud">🔊</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
               <Link href="/videos" className="flex flex-col items-center justify-center gap-3 p-8 bg-white rounded-2xl hover:bg-slate-50 transition-colors border border-slate-200 group focus-visible:outline-[#00CFB4] shadow-sm hover:shadow-md">
                 <span className="text-5xl group-hover:scale-110 transition-transform">📺</span>
                 <span className="text-xl font-bold text-[#0B2136]">Watch Videos</span>
               </Link>
               <Link href="/easy-reads" className="flex flex-col items-center justify-center gap-3 p-8 bg-white rounded-2xl hover:bg-slate-50 transition-colors border border-slate-200 group focus-visible:outline-[#00CFB4] shadow-sm hover:shadow-md">
                 <span className="text-5xl group-hover:scale-110 transition-transform">📚</span>
                 <span className="text-xl font-bold text-[#0B2136]">Easy Reads</span>
               </Link>
               <Link href="/workshops" className="flex flex-col items-center justify-center gap-3 p-8 bg-white rounded-2xl hover:bg-slate-50 transition-colors border border-slate-200 group focus-visible:outline-[#00CFB4] shadow-sm hover:shadow-md">
                 <span className="text-5xl group-hover:scale-110 transition-transform">🎨</span>
                 <span className="text-xl font-bold text-[#0B2136]">Workshops</span>
               </Link>
            </div>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}
