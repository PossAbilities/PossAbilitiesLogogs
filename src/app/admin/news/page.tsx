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
  const [mediaFiles, setMediaFiles] = useState<{ url?: string; file?: File, id: string }[]>([]);
  const [deletedMedia, setDeletedMedia] = useState<string[]>([]);

  const handleDelete = async (id: string) => {
    setLoading(true);
    // Optimistic UI update
    setNews(news.filter(item => item.id !== id));

    try {
      const res = await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("Error deleting:", msg);
      alert("Failed to delete from database. Please try again.");
      fetchNews(); // Revert on failure
    }
    setLoading(false);
  };

  const handleEdit = (article: NewsItem) => {
    setEditingArticle(article);
    if (article.imageUrls) {
      setMediaFiles(article.imageUrls.map(url => ({ url, id: Math.random().toString() })));
    } else {
      setMediaFiles([]);
    }
    setDeletedMedia([]);
    setView("form");
  };

  const handleAddNew = () => {
    setEditingArticle(null);
    setMediaFiles([]);
    setDeletedMedia([]);
    setView("form");
  };

  const handleAddMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        url: URL.createObjectURL(file), // Temp preview
        id: Math.random().toString()
      }));
      setMediaFiles([...mediaFiles, ...newFiles]);
    }
  };

  const handleRemoveMedia = (idToRemove: string, urlToRemove?: string) => {
    setMediaFiles(mediaFiles.filter(m => m.id !== idToRemove));
    if (urlToRemove && !urlToRemove.startsWith("blob:")) {
      setDeletedMedia([...deletedMedia, urlToRemove]);
    }
  };

  const uploadImage = async (file: File, articleId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${articleId}/${Math.random()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('news-media')
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('news-media')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const deleteImageFromStorage = async (fileUrl: string) => {
    try {
      if (fileUrl.includes('news-media/')) {
        const path = fileUrl.split('news-media/')[1];
        const { error } = await supabase.storage.from('news-media').remove([path]);
        if (error) console.error("Error deleting file from storage:", error.message);
      }
    } catch (e) {
      console.error("Failed to delete image:", e);
    }
  };

  const handleSaveNews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const articleId = editingArticle?.id || Date.now().toString();

    try {
      // 1. Delete trashed images from Storage
      await Promise.all(
        deletedMedia.map((url) => deleteImageFromStorage(url))
      );

      // 2. Upload new images and collect all URLs in parallel
      const uploadPromises = mediaFiles.map(async (media) => {
        if (media.file) {
          // It's a new file, upload it
          return await uploadImage(media.file, articleId);
        } else if (media.url && !media.url.startsWith("blob:")) {
          // It's an existing url that wasn't deleted
          return media.url;
        }
        return null;
      });

      const uploadResults = await Promise.all(uploadPromises);
      const finalImageUrls: string[] = uploadResults.filter((url): url is string => url !== null);

      const payload = {
        id: editingArticle ? editingArticle.id : undefined,
        title: formData.get("title") as string,
        summary: formData.get("summary") as string,
        content: formData.get("content") as string,
        image_url: 'placeholder', // Maintain primary placeholder logic
        image_urls: finalImageUrls,
        created_at: editingArticle?.date || new Date().toISOString(),
      };

      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to upsert");
      }

      alert("News Published Successfully! ✨");
      fetchNews(); // Refresh the list from DB
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("Error saving:", msg);
      alert("Something went wrong saving to Supabase! Falling back to local state.");

      // Fallback local update to keep UI functional without valid Supabase keys
      const newArticle: NewsItem = {
        id: articleId,
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        date: editingArticle?.date || new Date().toISOString(),
        imageUrls: mediaFiles.filter(m => !m.file && m.url).map(m => m.url as string) // Just keep what we had for mock
      };
      if (editingArticle) {
        setNews(news.map(item => item.id === newArticle.id ? newArticle : item));
      } else {
        setNews([newArticle, ...news]);
      }
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

            {/* Media Management Section */}
            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Media Management</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Upload Zone */}
                <label className="cursor-pointer relative w-full aspect-square rounded-3xl border-2 border-dashed border-white/20 backdrop-blur-xl bg-slate-800/30 hover:bg-slate-800/50 transition-all flex flex-col items-center justify-center group shadow-sm">
                  <span className="text-3xl text-slate-400 group-hover:text-white transition-colors group-hover:scale-110 drop-shadow-md">+</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2 group-hover:text-white transition-colors">Add Image</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleAddMedia} />
                </label>

                {/* Existing / Pending Media Items */}
                {mediaFiles.map((media) => (
                  <div key={media.id} className="relative w-full aspect-square rounded-3xl border border-white/20 backdrop-blur-md overflow-hidden group shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={media.url} alt="Media preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(media.id, media.url)}
                        className="w-10 h-10 rounded-full bg-pink-500/80 text-white flex items-center justify-center hover:bg-pink-500 hover:scale-110 transition-all shadow-lg backdrop-blur-md"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
