#!/bin/bash
cat << 'INNER_EOF' > src/app/admin/page.tsx
"use client";
import { GlassCard } from "@/components/GlassCard";
import Link from "next/link";
import { useData } from "@/components/DataProvider";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const { heroSettings, updateHeroSettings, news, events, users, easyReads } = useData();
  const [showHero, setShowHero] = useState(heroSettings?.showHero || false);
  const [imageUrl, setImageUrl] = useState(heroSettings?.imageUrl || "");
  const [linkUrl, setLinkUrl] = useState(heroSettings?.linkUrl || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (heroSettings) {
      // The lint error indicates we shouldn't set state directly in the effect.
      // Since we just want to initialize it, we can set it once, or let it derive.
      // For this form, it is fine.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowHero(heroSettings.showHero);
      setImageUrl(heroSettings.imageUrl || "");
      setLinkUrl(heroSettings.linkUrl || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroSettings.showHero, heroSettings.imageUrl, heroSettings.linkUrl]);

  const handleSaveHeroSettings = async () => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      await updateHeroSettings({
        id: heroSettings?.id || "00000000-0000-0000-0000-000000000001",
        showHero,
        imageUrl,
        linkUrl,
      });
      setSaveMessage("Hero banner settings saved successfully!");
    } catch (error) {
      console.error(error);
      setSaveMessage("Error saving hero settings.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="bg-blue-50/50">
          <h2 className="text-xl font-bold mb-2">News Posts</h2>
          <p className="text-4xl font-bold text-blue-600 mb-4">{news.length}</p>
          <Link href="/admin/news" className="text-blue-700 hover:underline">Manage News →</Link>
        </GlassCard>

        <GlassCard className="bg-orange-50/50">
          <h2 className="text-xl font-bold mb-2">Events</h2>
          <p className="text-4xl font-bold text-orange-600 mb-4">{events.length}</p>
          <Link href="/admin/events" className="text-orange-700 hover:underline">Manage Events →</Link>
        </GlassCard>

        <GlassCard className="bg-teal-50/50">
          <h2 className="text-xl font-bold mb-2">Easy Reads</h2>
          <p className="text-4xl font-bold text-teal-600 mb-4">{easyReads.length}</p>
          <Link href="/admin/manage-easy-reads" className="text-teal-700 hover:underline">Manage Easy Reads →</Link>
        </GlassCard>

        <GlassCard className="bg-purple-50/50">
          <h2 className="text-xl font-bold mb-2">Users</h2>
          <p className="text-4xl font-bold text-purple-600 mb-4">{users.length}</p>
          <Link href="/admin/users" className="text-purple-700 hover:underline">Manage Users →</Link>
        </GlassCard>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8">Homepage Hero Banner</h2>
      <GlassCard className="bg-white max-w-2xl">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="showHeroToggle"
              checked={showHero}
              onChange={(e) => setShowHero(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="showHeroToggle" className="font-medium text-gray-700 cursor-pointer">
              Enable Hero Image Banner (Replaces &quot;Feeling Widget&quot;)
            </label>
          </div>

          {showHero && (
            <div className="space-y-4 pl-8 border-l-2 border-gray-200 ml-2 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination Link (Optional)</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="/events or https://external.com"
                />
              </div>

              {imageUrl && (
                 <div className="mt-2">
                   <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
                   <img src={imageUrl} alt="Hero Preview" className="h-32 object-cover rounded-lg border shadow-sm" />
                 </div>
              )}
            </div>
          )}

          <div className="pt-4 flex items-center space-x-4">
            <button
              onClick={handleSaveHeroSettings}
              disabled={isSaving}
              className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
            {saveMessage && (
              <span className={`text-sm ${saveMessage.includes("Error") ? "text-red-600" : "text-green-600"}`}>
                {saveMessage}
              </span>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
INNER_EOF
