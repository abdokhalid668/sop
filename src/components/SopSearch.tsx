import React, { useState, useMemo } from 'react';
import { Search, Play, ChevronRight, BookOpen, Activity, AlertTriangle, ShieldCheck, Siren } from 'lucide-react';
import { motion } from 'motion/react';
import { SOP, FlowchartNode } from '../types';

interface SopSearchProps {
  sops: SOP[];
  onSelectSop: (sop: SOP) => void;
}

export default function SopSearch({ sops, onSelectSop }: SopSearchProps) {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return sops; // By default show all for discoverability
    const cleaned = query.toLowerCase().trim();
    return sops.filter(sop => {
      return (
        sop.sop_code.toLowerCase().includes(cleaned) ||
        sop.title_en.toLowerCase().includes(cleaned) ||
        sop.title_ar.includes(cleaned) ||
        sop.category.toLowerCase().includes(cleaned) ||
        sop.reference_documents.some(doc => doc.toLowerCase().includes(cleaned))
      );
    });
  }, [query, sops]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-start bg-slate-50/30">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        
        {/* Real-time search inputs */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-450" />
            </div>
            <input
              type="text"
              placeholder="ابحث بكود الدليل (مثال: DRI-DEG-103) أو بكلمة مفتاحية..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#059669] focus:bg-white transition-all text-sm font-bold"
              id="integrated-search-input"
            />
          </div>
          <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400 font-arabic flex-row-reverse" dir="rtl">
            <span>جاهز للبحث في {sops.length} من أدلة الإجراءات المعتمدة</span>
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="text-emerald-600 hover:text-emerald-700 font-extrabold focus:outline-none"
              >
                مسح التصفية
              </button>
            )}
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4 pb-20">
          <div className="text-[10px] font-arabic font-black text-slate-400 uppercase tracking-wider text-right" dir="rtl">
            {query.trim() ? `نتائج البحث (${searchResults.length} إجراء مطابق)` : `جميع الإجراءات المتوفرة (${sops.length} أدلة محملة)`}
          </div>

          {searchResults.length > 0 ? (
            searchResults.map((sop) => {
              const nodes = Object.values(sop.flowchart) as FlowchartNode[];
              const questionsCount = nodes.filter(n => n.type === 'question').length;
              
              // Define color-coded badges based on category
              const badgeStyles = () => {
                switch (sop.category) {
                  case 'normal':
                    return 'bg-emerald-50 text-emerald-800 border-emerald-200';
                  case 'degraded':
                    return 'bg-amber-50 text-amber-800 border-amber-200';
                  case 'emergency':
                    return 'bg-red-50 text-red-800 border-red-200';
                }
              };

              return (
                <motion.div
                  key={sop.sop_code}
                  whileHover={{ scale: 1.005 }}
                  onClick={() => onSelectSop(sop)}
                  className="group relative bg-white rounded-2xl border border-slate-200 p-5 text-right cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col sm:flex-row-reverse sm:items-center justify-between gap-4"
                  dir="rtl"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2.5 space-x-reverse flex-wrap gap-y-1">
                      <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700">
                        {sop.sop_code}
                      </span>
                      <span className={`text-[10px] font-arabic font-extrabold px-2 py-0.5 rounded border ${badgeStyles()}`}>
                        {sop.category === 'normal' 
                          ? 'الوضع الطبيعي' 
                          : sop.category === 'degraded' 
                          ? 'حالة غير طبيعية' 
                          : sop.category === 'emergency' 
                          ? 'طوارئ' 
                          : 'دليل أعطال'}
                      </span>
                    </div>

                    <div className="space-y-0.5 text-right">
                      <h3 className="text-sm sm:text-base font-arabic font-black text-slate-850 group-hover:text-slate-950 transition-colors">
                        {sop.title_ar}
                      </h3>
                    </div>

                    <div className="text-[10px] font-arabic text-slate-400 flex items-center space-x-2 space-x-reverse justify-start">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{sop.reference_documents.join('، ')}</span>
                      <span>•</span>
                      <span>{questionsCount} نقاط قرار تشخيصية</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSop(sop);
                      }}
                      className="flex items-center space-x-1.5 space-x-reverse px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-extrabold text-xs shadow-sm transition-all focus:outline-none font-arabic"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>بدء الإجراء</span>
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl py-12 text-center text-slate-600 shadow-sm" dir="rtl">
              <p className="font-bold text-sm font-arabic">لم يتم العثور على أي نتائج تطابق هذا البحث</p>
              <p className="text-xs text-slate-400 mt-1 font-arabic">جرب البحث بكلمات أخرى مثل فرامل، إشارة، حريق أو كود الدليل.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
