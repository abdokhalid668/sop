import React from 'react';
import { ShieldCheck, AlertTriangle, Siren, Wrench } from 'lucide-react';
import { motion } from 'motion/react';
import { SOP } from '../types';
 
interface DashboardProps {
  onSelectCategory: (category: 'normal' | 'degraded' | 'emergency' | 'troubleshooting') => void;
  importantInstructions?: string[];
}
 
export default function Dashboard({ onSelectCategory, importantInstructions = [] }: DashboardProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/30 px-4 md:px-6 py-6 md:py-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center space-y-4 md:space-y-8">
        
        {/* Important Management Instructions Banner */}
        {importantInstructions && importantInstructions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-sm text-right flex flex-col space-y-2 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-full w-2 bg-amber-500 animate-pulse" />
            
            <div className="flex items-center justify-end space-x-2 space-x-reverse text-amber-800">
              <span className="font-arabic font-black text-xs sm:text-sm">⚠️ تعليمات وقيود تشغيلية ضرورية من الإدارة</span>
              <span className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
            </div>
            
            <ul className="space-y-1.5 pr-2">
              {importantInstructions.map((instruction, idx) => (
                <li key={idx} className="text-[11px] sm:text-xs font-arabic font-bold text-amber-950 flex items-start justify-end gap-2">
                  <span className="text-right flex-1 leading-relaxed">{instruction}</span>
                  <span className="text-amber-500 shrink-0 select-none">•</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Title and Subtitle centered precisely as shown in the screenshot */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-arabic font-extrabold text-slate-900 tracking-tight">
            اختر حالة التشغيل
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm font-arabic font-medium text-slate-500">
            حدد مسار الإجراءات المناسب للحالة الحالية
          </p>
        </div>

        {/* 4 Vertically Stacked Giant Buttons */}
        <div className="w-full space-y-3 md:space-y-5">
          
          {/* 1. NORMAL MODE */}
          <motion.button
            whileHover={{ scale: 1.015, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelectCategory('normal')}
            className="w-full bg-[#f0fdf4] border-2 border-emerald-200 hover:border-emerald-400 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow-md group focus:outline-none focus:ring-4 focus:ring-emerald-500/10 h-24 sm:h-28 md:h-32 lg:h-36"
            id="btn-category-normal"
          >
            <div className="flex flex-col items-center justify-center space-y-2 md:space-y-2.5">
              {/* Green circle with checkmark */}
              <div className="w-7 h-7 md:w-9 md:h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-base sm:text-lg md:text-xl font-arabic font-black text-emerald-800 transition-colors">
                الوضع الطبيعي
              </span>
            </div>
          </motion.button>

          {/* 2. DEGRADED MODE */}
          <motion.button
            whileHover={{ scale: 1.015, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelectCategory('degraded')}
            className="w-full bg-[#fffbeb] border-2 border-amber-200 hover:border-amber-400 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow-md group focus:outline-none focus:ring-4 focus:ring-amber-500/10 h-24 sm:h-28 md:h-32 lg:h-36"
            id="btn-category-degraded"
          >
            <div className="flex flex-col items-center justify-center space-y-2 md:space-y-2.5">
              {/* Orange warning triangle */}
              <div className="w-7 h-7 md:w-9 md:h-9 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-sm shadow-amber-500/20">
                <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-white fill-current" />
              </div>
              <span className="text-base sm:text-lg md:text-xl font-arabic font-black text-amber-800 transition-colors">
                الوضع غير الطبيعي
              </span>
            </div>
          </motion.button>

          {/* 3. EMERGENCY MODE */}
          <motion.button
            whileHover={{ scale: 1.015, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelectCategory('emergency')}
            className="w-full bg-[#fff1f2] border-2 border-red-200 hover:border-red-400 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow-md group focus:outline-none focus:ring-4 focus:ring-red-500/10 h-24 sm:h-28 md:h-32 lg:h-36"
            id="btn-category-emergency"
          >
            <div className="flex flex-col items-center justify-center space-y-2 md:space-y-2.5">
              {/* Red warning beacon/siren icon */}
              <div className="w-7 h-7 md:w-9 md:h-9 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-sm shadow-rose-500/20">
                <Siren className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-base sm:text-lg md:text-xl font-arabic font-black text-red-800 transition-colors">
                حالات الطوارئ
              </span>
            </div>
          </motion.button>

          {/* 4. TROUBLESHOOTING GUIDE */}
          <motion.button
            whileHover={{ scale: 1.015, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelectCategory('troubleshooting')}
            className="w-full bg-[#f0f9ff] border-2 border-sky-200 hover:border-sky-400 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow-md group focus:outline-none focus:ring-4 focus:ring-sky-500/10 h-24 sm:h-28 md:h-32 lg:h-36"
            id="btn-category-troubleshooting"
          >
            <div className="flex flex-col items-center justify-center space-y-2 md:space-y-2.5">
              {/* Blue wrench/troubleshooting icon */}
              <div className="w-7 h-7 md:w-9 md:h-9 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-sm shadow-sky-500/20">
                <Wrench className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-base sm:text-lg md:text-xl font-arabic font-black text-sky-800 transition-colors">
                دليل الأعطال
              </span>
            </div>
          </motion.button>

        </div>

      </div>
    </div>
  );
}
