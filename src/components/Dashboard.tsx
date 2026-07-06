import React from 'react';
import { ShieldCheck, AlertTriangle, Siren, Wrench } from 'lucide-react';
import { motion } from 'motion/react';
import { SOP } from '../types';
 
interface DashboardProps {
  onSelectCategory: (category: 'normal' | 'degraded' | 'emergency' | 'troubleshooting') => void;
}
 
export default function Dashboard({ onSelectCategory }: DashboardProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/30 px-6 py-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center space-y-8">
        
        {/* Title and Subtitle centered precisely as shown in the screenshot */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-arabic font-extrabold text-slate-900 tracking-tight">
            اختر حالة التشغيل
          </h2>
          <p className="text-xs sm:text-sm font-arabic font-medium text-slate-500">
            حدد مسار الإجراءات المناسب للحالة الحالية
          </p>
        </div>

        {/* 3 Vertically Stacked Giant Buttons */}
        <div className="w-full space-y-5">
          
          {/* 1. NORMAL MODE */}
          <motion.button
            whileHover={{ scale: 1.015, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelectCategory('normal')}
            className="w-full bg-[#f0fdf4] border-2 border-emerald-200 hover:border-emerald-400 rounded-3xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow-md group focus:outline-none focus:ring-4 focus:ring-emerald-500/10 h-36"
            id="btn-category-normal"
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              {/* Green circle with checkmark */}
              <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black text-emerald-800 tracking-wide font-sans group-hover:text-emerald-900 transition-colors">
                Normal
              </span>
              <span className="text-xs font-arabic font-bold text-emerald-600">
                الوضع الطبيعي
              </span>
            </div>
          </motion.button>

          {/* 2. DEGRADED MODE */}
          <motion.button
            whileHover={{ scale: 1.015, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelectCategory('degraded')}
            className="w-full bg-[#fffbeb] border-2 border-amber-200 hover:border-amber-400 rounded-3xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow-md group focus:outline-none focus:ring-4 focus:ring-amber-500/10 h-36"
            id="btn-category-degraded"
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              {/* Orange warning triangle */}
              <div className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-sm shadow-amber-500/20">
                <AlertTriangle className="w-5 h-5 text-white fill-current" />
              </div>
              <span className="text-lg font-black text-amber-800 tracking-wide font-sans group-hover:text-amber-900 transition-colors">
                Degraded
              </span>
              <span className="text-xs font-arabic font-bold text-amber-600">
                الوضع غير الطبيعي
              </span>
            </div>
          </motion.button>

          {/* 3. EMERGENCY MODE */}
          <motion.button
            whileHover={{ scale: 1.015, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelectCategory('emergency')}
            className="w-full bg-[#fff1f2] border-2 border-red-200 hover:border-red-400 rounded-3xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow-md group focus:outline-none focus:ring-4 focus:ring-red-500/10 h-36"
            id="btn-category-emergency"
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              {/* Red warning beacon/siren icon */}
              <div className="w-9 h-9 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-sm shadow-rose-500/20">
                <Siren className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black text-red-800 tracking-wide font-sans group-hover:text-red-900 transition-colors">
                Emergency
              </span>
              <span className="text-xs font-arabic font-bold text-red-600">
                حالات الطوارئ
              </span>
            </div>
          </motion.button>

          {/* 4. TROUBLESHOOTING GUIDE */}
          <motion.button
            whileHover={{ scale: 1.015, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelectCategory('troubleshooting')}
            className="w-full bg-[#f0f9ff] border-2 border-sky-200 hover:border-sky-400 rounded-3xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow-md group focus:outline-none focus:ring-4 focus:ring-sky-500/10 h-36"
            id="btn-category-troubleshooting"
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              {/* Blue wrench/troubleshooting icon */}
              <div className="w-9 h-9 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-sm shadow-sky-500/20">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black text-sky-800 tracking-wide font-sans group-hover:text-sky-900 transition-colors">
                Troubleshooting
              </span>
              <span className="text-xs font-arabic font-bold text-sky-600">
                دليل الأعطال
              </span>
            </div>
          </motion.button>

        </div>

      </div>
    </div>
  );
}
