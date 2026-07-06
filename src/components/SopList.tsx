import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { SOP } from '../types';

interface SopListProps {
  category: 'normal' | 'degraded' | 'emergency' | 'troubleshooting';
  sops: SOP[];
  onBack: () => void;
  onSelectSop: (sop: SOP) => void;
  favorites?: string[];
  onToggleFavorite?: (sopCode: string) => void;
}

export default function SopList({ 
  category, 
  sops, 
  onBack, 
  onSelectSop, 
  favorites = [], 
  onToggleFavorite 
}: SopListProps) {
  // Let activeCategory be controlled internally to support tabs
  const [activeCategory, setActiveCategory] = useState<'normal' | 'degraded' | 'emergency' | 'troubleshooting'>(category);

  // Synchronize state if parent category changes
  useEffect(() => {
    setActiveCategory(category);
  }, [category]);

  // Filter SOPs to only those matching the active category
  const filteredSops = sops.filter(sop => sop.category === activeCategory);

  const getCategoryArabicTitle = () => {
    switch (activeCategory) {
      case 'normal':
        return 'الوضع الطبيعي';
      case 'degraded':
        return 'الحالات غير الطبيعية';
      case 'emergency':
        return 'حالات الطوارئ';
      case 'troubleshooting':
        return 'دليل الأعطال';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-start bg-[#f8fafc]" dir="rtl">
      
      {/* Arabic Header matching screenshot */}
      <div className="max-w-4xl mx-auto w-full mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            {/* Back button with right arrow */}
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center bg-white border border-slate-150 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:bg-slate-50 text-slate-800 transition-colors focus:outline-none cursor-pointer"
              id="btn-back-to-home"
            >
              <ArrowRight className="w-5 h-5 text-slate-700" />
            </button>
            
            <div className="text-right">
              <h1 className="text-2xl font-black text-slate-900 font-arabic leading-none mb-1">
                {getCategoryArabicTitle()}
              </h1>
              <p className="text-xs text-slate-400 font-arabic font-bold">
                يعرض {filteredSops.length} من الإجراءات التشغيلية المعتمدة
              </p>
            </div>
          </div>

          {/* Polished Mode Selector Strip at the Top */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 self-stretch md:self-auto overflow-x-auto scrollbar-none">
            <div className="flex space-x-1 space-x-reverse w-full md:w-auto">
              <button
                onClick={() => setActiveCategory('normal')}
                className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-arabic font-black transition-all duration-200 cursor-pointer whitespace-nowrap focus:outline-none ${
                  activeCategory === 'normal'
                    ? 'bg-emerald-600 text-white shadow-[0_2px_6px_rgba(5,150,105,0.2)]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                الوضع الطبيعي
              </button>
              <button
                onClick={() => setActiveCategory('degraded')}
                className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-arabic font-black transition-all duration-200 cursor-pointer whitespace-nowrap focus:outline-none ${
                  activeCategory === 'degraded'
                    ? 'bg-amber-500 text-white shadow-[0_2px_6px_rgba(245,158,11,0.2)]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                الحالات غير الطبيعية
              </button>
              <button
                onClick={() => setActiveCategory('emergency')}
                className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-arabic font-black transition-all duration-200 cursor-pointer whitespace-nowrap focus:outline-none ${
                  activeCategory === 'emergency'
                    ? 'bg-red-600 text-white shadow-[0_2px_6px_rgba(220,38,38,0.2)]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                حالات الطوارئ
              </button>
              <button
                onClick={() => setActiveCategory('troubleshooting')}
                className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-arabic font-black transition-all duration-200 cursor-pointer whitespace-nowrap focus:outline-none ${
                  activeCategory === 'troubleshooting'
                    ? 'bg-sky-600 text-white shadow-[0_2px_6px_rgba(14,165,233,0.2)]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                دليل الأعطال
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Index list of SOPs */}
      <div className="max-w-4xl mx-auto w-full flex-1 space-y-3 pb-24">
        {filteredSops.length > 0 ? (
          filteredSops.map((sop, idx) => {
            const isFav = favorites.includes(sop.sop_code);
            return (
              <motion.div
                key={sop.sop_code}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
                whileHover={{ scale: 1.002 }}
                onClick={() => onSelectSop(sop)}
                className="group bg-white rounded-2xl border border-slate-100 p-5 cursor-pointer transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
                id={`sop-row-${sop.sop_code}`}
              >
                <div className="flex items-center justify-between w-full">
                  {/* Right side: SOP Code, Status (قريباً), and Title */}
                  <div className="flex flex-col items-start text-right space-y-2">
                    {/* Top Row: Code */}
                    <div className="flex items-center space-x-2.5 space-x-reverse">
                      {/* Code Badge */}
                      <span className="font-mono text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-slate-50 border border-slate-150 text-slate-500 tracking-wider">
                        {sop.sop_code}
                      </span>
                    </div>

                    {/* Arabic Title */}
                    <h3 className="text-base sm:text-lg font-arabic font-black text-slate-800 group-hover:text-emerald-700 transition-colors">
                      {sop.title_ar}
                    </h3>
                  </div>

                  {/* Left side: Heart Button */}
                  <div className="shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleFavorite) {
                          onToggleFavorite(sop.sop_code);
                        }
                      }}
                      className={`w-10 h-10 flex items-center justify-center bg-white border rounded-full transition-all focus:outline-none cursor-pointer ${
                        isFav
                          ? 'border-red-200 text-red-500 bg-red-50/30'
                          : 'border-slate-150 text-slate-300 hover:text-red-500 hover:border-red-100'
                      }`}
                      id={`btn-fav-sop-${sop.sop_code}`}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill={isFav ? "currentColor" : "none"} 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="w-4.5 h-4.5"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl py-12 text-center text-slate-500 shadow-sm" dir="rtl">
            <p className="font-bold font-arabic">لا توجد إجراءات تشغيلية محملة لهذه الفئة حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
}
