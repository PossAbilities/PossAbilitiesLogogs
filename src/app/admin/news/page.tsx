"use client";

import { useState } from "react";
import { useData } from "@/components/DataProvider";
import { NewsItem } from "@/lib/data";
import { supabase } from "@/utils/supabase";

export default function AdminNewsPage() {
  const { news, setNews, fetchNews } = useData();
  const [editingArticle, setEditingArticle] = useState<NewsItem | null>(null);
  const [view, setView] = useState<"list" | "form">("list");
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    setLoading(true);
    // Optimistic UI update
    setNews(news.filter(item => item.id !== id));

    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) {
      console.error("Error deleting:", error.message);
      alert("Failed to delete from database. Please try again.");
      fetchNews(); // Revert on failure
    }
    setLoading(false);
  };

  const handleEdit = (article: NewsItem) => {
    setEditingArticle(article);
    setView("form");
  };

  const handleAddNew = () => {
    setEditingArticle(null);
    setView("form");
  };

  const handleSaveNews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      id: editingArticle?.id || undefined, // Supabase creates one if undefined
      title: formData.get("title") as string,
      summary: formData.get("summary") as string,
      content: formData.get("content") as string,
      image_url: 'placeholder', // Using the ADVOCACY placeholder logic
      created_at: editingArticle?.date || new Date().toISOString(),
    };

    const { error } = await supabase
      .from('news')
      .upsert(payload)
      .select();

    if (error) {
      console.error("Error saving:", error.message);
      alert("Something went wrong saving to Supabase! Falling back to local state.");

      // Fallback local update to keep UI functional without valid Supabase keys
      const newArticle: NewsItem = {
        id: editingArticle?.id || Date.now().toString(),
        title: payload.title,
        content: payload.content,
        date: payload.created_at,
      };
      if (editingArticle) {
        setNews(news.map(item => item.id === newArticle.id ? newArticle : item));
      } else {
        setNews([newArticle, ...news]);
      }
    } else {
      alert("News Published Successfully! ✨");
      fetchNews(); // Refresh the list from DB
    }

    setLoading(false);
    setView("list");
  };

  if (view === "form") {
    return (
      <div className="bg-slate-900/95 p-8 md:p-10 rounded-3xl border border-slate-700 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black tracking-tight text-white">
            {editingArticle ? "Edit Article" : "Create New Article"}
          </h2>
          <button
            onClick={() => setView("list")}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSaveNews} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Title</label>
              <input
                name="title"
                defaultValue={editingArticle?.title}
                required
                className="w-full bg-slate-950/50 border border-slate-700/50 p-4 rounded-xl text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                placeholder="Enter article title"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Summary</label>
              <input
                name="summary"
                className="w-full bg-slate-950/50 border border-slate-700/50 p-4 rounded-xl text-white focus:outline-none focus:border-teal-500 transition-all"
                placeholder="Short description for the gallery card"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Main Content</label>
              <textarea
                name="content"
                defaultValue={editingArticle?.content}
                required
                className="w-full bg-slate-950/50 border border-slate-700/50 p-4 rounded-xl text-white focus:outline-none focus:border-teal-500 transition-all font-sans leading-relaxed"
                placeholder="Write your article content here..."
                rows={8}
              />
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={loading}
                className="bg-pink-500/80 hover:bg-pink-500 text-white backdrop-blur-md px-8 py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(236,0,140,0.3)] transition-all border border-pink-400/30 disabled:opacity-50"
              >
                {loading ? "Publishing..." : "Publish Changes"}
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                disabled={loading}
                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Live Preview Column */}
          <div className="hidden lg:block space-y-6">
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Thumbnail & Card Preview</label>
            <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center min-h-[400px]">

              <article className="w-full max-w-sm bg-white/10 rounded-2xl border border-white/20 shadow-lg overflow-hidden backdrop-blur-md">
                {/* The Premium Thumbnail Preview */}
                <div className="relative w-full aspect-video bg-teal-500 border-b border-white/20 flex items-center justify-center">
                   <div className="absolute inset-0 bg-gradient-to-tr from-teal-600 to-teal-400"></div>
                   <span className="text-white font-black tracking-widest text-xl uppercase drop-shadow-md z-10">
                     ADVOCACY
                   </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white/90">
                    {editingArticle?.title || "Article Title Preview"}
                  </h3>
                  <p className="text-slate-300 text-sm line-clamp-3">
                    {editingArticle?.content || "This is how the content will look in the preview card..."}
                  </p>
                </div>
              </article>

              <p className="text-xs text-slate-500 mt-6 text-center">
                This is how the card will appear on the public News Gallery.
              </p>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tighter text-slate-800">News Management</h1>
        <button
          onClick={handleAddNew}
          className="bg-slate-900 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-full transition-colors shadow-lg shadow-slate-900/20"
        >
          + Create Post
        </button>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-slate-300">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="p-6 font-bold uppercase tracking-wider text-xs text-slate-500">Title</th>
                <th className="p-6 font-bold uppercase tracking-wider text-xs text-slate-500">Date Published</th>
                <th className="p-6 font-bold uppercase tracking-wider text-xs text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item.id} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors">
                  <td className="p-6 font-semibold text-white">{item.title}</td>
                  <td className="p-6 text-slate-400">
                    {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-6 text-right space-x-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-teal-400 font-bold hover:text-teal-300 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-pink-500 font-bold hover:text-pink-400 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
