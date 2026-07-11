import React from 'react';
import { Heart, Play, ChevronRight, BookOpen, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { SOP } from '../types';

interface SopFavoritesProps {
  sops: SOP[];
  favorites: string[];
  onToggleFavorite: (sopCode: string) => void;
  onSelectSop: (sop: SOP) => void;
}

export default function SopFavorites({ sops, favorites, onToggleFavorite, onSelectSop }: SopFavoritesProps) {
  // Filter SOPs to only those in the favorites list
  const favoriteSops = sops.filter(sop => favorites.includes(sop.sop_code));

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-start bg-slate-50/30">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        
        {/* Title Info Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-right relative overflow-hidden" dir="rtl">
          <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-rose-500/5 to-transparent pointer-events-none" />
          <div className="flex items-center space-x-2 space-x-reverse text-rose-600 mb-1">
            <Heart className="w-5 h-5 fill-current" />
            <h2 className="text-base font-arabic font-extrabold tracking-wide">
              الإجراءات المفضلة التشغيلية
            </h2>
          </div>
          <p className="text-xs font-arabic font-extrabold text-slate-500">
            قائمة الأدلة المفضلة للوصول السريع والآمن أثناء القيادة
          </p>
        </div>

        {/* Favorite Items */}
        <div className="space-y-4 pb-32 sm:pb-40">
          {favoriteSops.length > 0 ? (
            favoriteSops.map((sop) => {
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
                  className="group relative bg-white rounded-2xl border border-slate-200 p-5 text-right transition-all shadow-sm flex flex-col sm:flex-row-reverse sm:items-center justify-between gap-4"
                  dir="rtl"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2.5 space-x-reverse flex-wrap gap-y-1">
                      <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-750">
                        {sop.sop_code}
                      </span>
                      <span className={`text-[10px] font-arabic font-bold px-2 py-0.5 rounded border ${badgeStyles()}`}>
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

                    <div className="text-[10px] font-mono text-slate-455 flex items-center space-x-2 space-x-reverse justify-start">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{sop.reference_documents.join(', ')}</span>
                    </div>
                  </div>

                  {/* Actions (Launch and Remove) */}
                  <div className="shrink-0 flex items-center space-x-2 space-x-reverse justify-end">
                    {/* Delete Icon */}
                    <button
                      onClick={() => onToggleFavorite(sop.sop_code)}
                      className="p-2.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-slate-100 hover:border-rose-100 transition-colors cursor-pointer"
                      title="إزالة من المفضلة"
                      id={`btn-remove-fav-${sop.sop_code}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Launch button */}
                    <button
                      onClick={() => onSelectSop(sop)}
                      className="flex items-center space-x-1.5 space-x-reverse px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-extrabold text-xs shadow-sm transition-all focus:outline-none cursor-pointer font-arabic"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>بدء الإجراء</span>
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl py-16 text-center text-slate-600 shadow-sm flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-400">
                <Heart className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-extrabold text-sm text-slate-800">لا يوجد أدلة مفضلة حتى الآن</p>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed px-6">
                  يمكنك إضافة أي دليل إجراءات إلى المفضلة بالضغط على أيقونة القلب في خطوات التشغيل للوصول السريع إليها لاحقاً.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
