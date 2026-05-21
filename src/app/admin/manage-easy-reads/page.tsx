"use client";

import { useData } from "@/components/DataProvider";
import { GlassCard } from "@/components/GlassCard";
import { useState } from "react";

export default function ManageEasyReadsPage() {
  const { easyReads, toggleEasyReadVisibility } = useData();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setLoadingId(id);
    try {
      await toggleEasyReadVisibility(id, currentStatus);
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tighter text-slate-800">Manage Easy Reads Data</h1>
      </div>

      <GlassCard className="bg-slate-900/95 border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-white">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="p-4 font-bold uppercase tracking-widest text-slate-400 text-xs">Title</th>
                <th className="p-4 font-bold uppercase tracking-widest text-slate-400 text-xs">Description</th>
                <th className="p-4 font-bold uppercase tracking-widest text-slate-400 text-xs">Cover</th>
                <th className="p-4 font-bold uppercase tracking-widest text-slate-400 text-xs">File Link</th>
                <th className="p-4 font-bold uppercase tracking-widest text-slate-400 text-xs">Show on Portal</th>
              </tr>
            </thead>
            <tbody>
              {easyReads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-400 py-8">
                    No Easy Reads found.
                  </td>
                </tr>
              ) : (
                easyReads.map((item) => (
                  <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-medium">{item.title}</td>
                    <td className="p-4 text-slate-300 text-sm max-w-xs truncate">{item.content}</td>
                    <td className="p-4">
                      {item.coverUrl ? (
                         // eslint-disable-next-line @next/next/no-img-element
                         <img src={item.coverUrl} alt="Cover" className="w-12 h-12 object-cover rounded-md" />
                      ) : (
                        <span className="text-slate-500 text-xs">N/A</span>
                      )}
                    </td>
                    <td className="p-4">
                      {item.fileUrl ? (
                        <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 text-sm">
                          View PDF
                        </a>
                      ) : (
                        <span className="text-slate-500 text-xs">N/A</span>
                      )}
                    </td>
                    <td className="p-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={item.showOnPortal}
                          disabled={loadingId === item.id}
                          onChange={() => handleToggle(item.id, item.showOnPortal ?? true)}
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                        {loadingId === item.id && <span className="ml-3 text-xs text-slate-400">...</span>}
                      </label>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
