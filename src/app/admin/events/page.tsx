"use client";

import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { useData } from "@/components/DataProvider";
import { supabase } from "@/utils/supabase";

export default function AdminEventsPage() {
  const { events, setEvents, fetchEvents } = useData();
  const [loading, setLoading] = useState(false);
  const [mediaFile, setMediaFile] = useState<{ url?: string; file?: File } | null>(null);

  const handleDelete = async (id: string) => {
    setLoading(true);
    setEvents(events.filter(item => item.id !== id));

    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
      console.error("Error deleting:", error.message);
      alert("Failed to delete from database.");
      fetchEvents();
    }
    setLoading(false);
  };

  const handleAddMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setMediaFile({
        file,
        url: URL.createObjectURL(file)
      });
    }
  };

  const uploadImage = async (file: File, eventId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${eventId}/${Math.random()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('events-media')
      .upload(fileName, file);

    if (error) {
      // If bucket doesn't exist, try news-media as fallback or ignore
      const { error: fallbackError } = await supabase.storage
        .from('news-media')
        .upload(`events-${fileName}`, file);
      if (fallbackError) throw fallbackError;
      const { data } = supabase.storage.from('news-media').getPublicUrl(`events-${fileName}`);
      return data.publicUrl;
    }

    const { data: urlData } = supabase.storage
      .from('events-media')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const location = formData.get('location') as string;

    const eventId = Date.now().toString();
    let uploadedUrl = null;

    try {
      if (mediaFile?.file) {
        uploadedUrl = await uploadImage(mediaFile.file, eventId);
      }

      const isoDate = new Date(`${date}T${time || '12:00'}:00`).toISOString();

      const newEvent = {
        id: eventId,
        title: title || "New Event",
        description: "This is a newly added event.",
        location: location || "TBD",
        date: isoDate,
        imageUrl: uploadedUrl || undefined
      };

      // Optimistic
      setEvents([newEvent, ...events]);

      const { error } = await supabase.from('events').upsert({
        id: eventId,
        title: newEvent.title,
        description: newEvent.description,
        location: newEvent.location,
        event_date: isoDate,
        image_url: uploadedUrl || null
      });

      if (error) {
        console.error("DB Error:", error);
        // Supabase schema might be slightly different. Let's try matching News table structure
        // if events table is missing or columns differ
        await supabase.from('events').upsert({
          id: eventId,
          title: newEvent.title,
          content: newEvent.description, // some schemas use content
          created_at: isoDate,
          image_url: uploadedUrl || null
        });
      }

      e.currentTarget?.reset?.();
      setMediaFile(null);
    } catch (err) {
      console.error("Error saving event:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold text-[#0B2136]">Events Control Panel</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Creator Form side */}
        <section>
          <GlassCard className="bg-white/90 border-white/50 relative overflow-hidden">
            <h2 className="text-xl font-bold text-[#0B2136] mb-6">Create New Event</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input
                name="title"
                type="text"
                placeholder="Event Title (e.g., Summer BBQ)"
                className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00CFB4] transition-all text-slate-800 placeholder-slate-400"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                 <input
                  name="date"
                  type="date"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00CFB4] transition-all text-slate-800"
                  required
                 />
                 <input
                  name="time"
                  type="time"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00CFB4] transition-all text-slate-800"
                 />
              </div>
              <input
                name="location"
                type="text"
                placeholder="Location"
                className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00CFB4] transition-all text-slate-800 placeholder-slate-400"
                required
              />

              <div className="pt-2">
                <label className="block text-sm font-bold text-[#4B708B] mb-2">Event Thumbnail Image</label>
                {/* Glassmorphic Upload Zone */}
                <label className="border-2 border-dashed border-[#A7C0D8] rounded-2xl p-8 text-center bg-gradient-to-br from-[#E8F3FA]/50 to-white hover:border-[#00CFB4] transition-colors cursor-pointer group block relative overflow-hidden">
                  {mediaFile?.url ? (
                    <img src={mediaFile.url} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                         🖼️
                      </div>
                      <p className="text-sm font-bold text-[#0B2136]">Click to upload image</p>
                      <p className="text-xs text-[#4B708B] mt-1">Recommended size: 16:10 aspect ratio</p>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAddMedia} />
                </label>
              </div>

              <button disabled={loading} type="submit" className="w-full bg-[#00CFB4] hover:bg-[#00B39B] text-white font-bold py-3 px-6 rounded-xl transition-colors mt-6 shadow-sm disabled:opacity-50">
                {loading ? 'Publishing...' : 'Publish Event to Portal'}
              </button>
            </form>
          </GlassCard>
        </section>

        {/* Existing Events side */}
        <section>
          <h2 className="text-xl font-bold text-[#0B2136] mb-6">Manage Existing Events</h2>
          <div className="space-y-4">
             {events.map((event) => (
               <GlassCard key={event.id} className="p-4 bg-white/70 hover:bg-white/90 border-white/40 flex items-center gap-4 transition-colors">
                  {/* Mini thumbnail preview */}
                  <div className="w-20 h-20 rounded-lg bg-[#E8F3FA] border border-[#A7C0D8] flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-black tracking-wider text-[#00CFB4]">ADVOCACY</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#0B2136]">{event.title}</h3>
                    <p className="text-sm text-[#4B708B] mt-1 flex gap-2">
                      <span>{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                      &bull;
                      <span>{new Date(event.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                      &bull;
                      <span>{event.location}</span>
                    </p>
                  </div>
                  <button disabled={loading} onClick={() => handleDelete(event.id)} className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50" aria-label="Delete event">
                    🗑️
                  </button>
               </GlassCard>
             ))}
          </div>
        </section>
      </div>
    </div>
  );
}
