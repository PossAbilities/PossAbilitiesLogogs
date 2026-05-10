"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

interface EasyReadSection {
  id: string;
  text: string;
  imageUrl: string | null;
}

export default function EasyReadGuideCreator() {
  const [sections, setSections] = useState<EasyReadSection[]>([
    { id: "1", text: "This is an easy read guide.", imageUrl: null },
  ]);

  const handleAddSection = () => {
    setSections([...sections, { id: Math.random().toString(), text: "", imageUrl: null }]);
  };

  const handleUpdateText = (id: string, newText: string) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, text: newText } : s)));
  };

  const handleUpdateImage = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setSections(sections.map((s) => (s.id === id ? { ...s, imageUrl: url } : s)));
    }
  };

  const handleRemoveSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let yOffset = 20;

    // Title of the Guide
    doc.setFontSize(22);
    doc.text("PossAbilities Easy Read Guide", 20, yOffset);
    yOffset += 20;

    sections.forEach((section) => {
      // 1. Add Image (Placeholder logic)
      // If we had a real image URL, we'd need to convert it to base64 or fetch it.
      // For now, per instructions, we use the Teal placeholder.
      doc.setFillColor(102, 204, 204); // Your brand Teal
      doc.roundedRect(20, yOffset, 50, 40, 5, 5, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text("ADVOCACY", 32, yOffset + 22);

      // 2. Add Simple Text
      doc.setTextColor(26, 26, 46); // Near black
      doc.setFontSize(16);
      // This wraps the text so it doesn't run off the page
      const splitText = doc.splitTextToSize(section.text || "...", 100);
      doc.text(splitText, 80, yOffset + 15);

      yOffset += 50; // Move down for the next section

      // Basic pagination
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
    });

    doc.save("Easy-Read-Guide.pdf");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tighter text-slate-800">Easy Read Guide Creator</h1>
        <button
          onClick={handleExportPDF}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-full transition-all shadow-[0_0_20px_rgba(45,212,191,0.4)] border border-teal-400 hover:shadow-[0_0_30px_rgba(45,212,191,0.6)] flex items-center gap-2"
        >
          <span>📄</span> Export as PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* LEFT SIDE: Clinical Admin Form */}
        <div className="bg-slate-900/95 p-8 rounded-3xl border border-slate-700 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
             <h2 className="text-xl font-bold text-white tracking-widest uppercase">Content Sections</h2>
             <button
               onClick={handleAddSection}
               className="text-teal-400 hover:text-teal-300 font-bold transition-colors text-sm uppercase tracking-wider"
             >
               + Add Row
             </button>
          </div>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={section.id} className="relative bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50 space-y-4 group">
                <button
                  onClick={() => handleRemoveSection(section.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-pink-500/10 text-pink-500 hover:bg-pink-500 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  title="Remove Section"
                >
                  ✕
                </button>
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
                  <span>Row {index + 1}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Image</label>
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full aspect-square rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-800 transition-colors overflow-hidden group/upload">
                       {section.imageUrl ? (
                         // eslint-disable-next-line @next/next/no-img-element
                         <img src={section.imageUrl} alt={`Preview for row ${index + 1}`} className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-slate-500 group-hover/upload:text-white text-2xl transition-colors">+</span>
                       )}
                       <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpdateImage(section.id, e)} />
                    </label>
                  </div>

                  <div className="md:col-span-2">
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Simple Text</label>
                     <textarea
                       value={section.text}
                       onChange={(e) => handleUpdateText(section.id, e.target.value)}
                       placeholder="Enter a single, clear sentence..."
                       className="w-full h-full min-h-[120px] bg-slate-900 border border-slate-700/50 p-4 rounded-xl text-white focus:outline-none focus:border-teal-500 transition-colors font-sans text-lg"
                     />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: High-Gloss Glass Preview */}
        <div className="sticky top-8">
           <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Live PDF Preview</h2>
           <div className="w-full aspect-[1/1.414] bg-white/40 rounded-3xl border border-white/50 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] p-8 md:p-12 overflow-y-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 pointer-events-none rounded-3xl"></div>

              <div className="relative z-10 space-y-12">
                 {/* Document Header Preview */}
                 <div className="border-b-4 border-teal-500 pb-6 mb-12">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Easy Read Guide</h1>
                 </div>

                 {/* Easy Read Rows */}
                 {sections.map((section) => (
                   <div key={section.id} className="flex flex-col md:flex-row items-center gap-8 bg-white/60 p-6 rounded-3xl border border-white/60 shadow-sm backdrop-blur-md">

                     <div className="w-full md:w-1/3 shrink-0">
                        {section.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={section.imageUrl} alt="" className="w-full aspect-square rounded-3xl object-cover shadow-md border-4 border-white" />
                        ) : (
                          <div className="w-full aspect-square bg-teal-500 rounded-3xl border-4 border-white shadow-md flex items-center justify-center relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-tr from-teal-600 to-teal-400"></div>
                             <span className="text-white font-black tracking-widest text-lg md:text-xl uppercase drop-shadow-md z-10">
                               ADVOCACY
                             </span>
                          </div>
                        )}
                     </div>

                     <div className="w-full md:w-2/3">
                        <p className="text-[24px] font-bold text-slate-900 leading-[1.6] tracking-tight">
                           {section.text || "Type your simple sentence here..."}
                        </p>
                     </div>

                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
