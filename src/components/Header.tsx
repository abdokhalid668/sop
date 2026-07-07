import React, { useState, useEffect } from 'react';
import { 
  Shield, Signal, Battery, Settings, UserCheck, Train, Wifi, Check, X,
  Cloud, LogOut, FileSpreadsheet, ExternalLink, RefreshCw
} from 'lucide-react';

interface HeaderProps {
  driverId: string;
  setDriverId: (val: string) => void;
  trainId: string;
  setTrainId: (val: string) => void;
  trainLocation: string;
  setTrainLocation: (val: string) => void;
  logsCount: number;
  onOpenLogs: () => void;
  onGoHome: () => void;
  
  // Google Sheets integration props
  googleUser: any;
  spreadsheetUrl: string | null;
  spreadsheetName: string | null;
  isSyncingSheets: boolean;
  sheetsError: string | null;
  onGoogleLogin: () => void;
  onGoogleLogout: () => void;
  onCreateNewSheet: () => void;
  onSyncAllHistory: () => void;
}

export default function Header({
  driverId,
  setDriverId,
  trainId,
  setTrainId,
  trainLocation,
  setTrainLocation,
  logsCount,
  onOpenLogs,
  onGoHome,
  googleUser,
  spreadsheetUrl,
  spreadsheetName,
  isSyncingSheets,
  sheetsError,
  onGoogleLogin,
  onGoogleLogout,
  onCreateNewSheet,
  onSyncAllHistory
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [arabicDate, setArabicDate] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTimeAndDate = () => {
      const now = new Date();
      
      // Time format (HH:MM:SS)
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      }));

      // Arabic Date format (e.g. الإثنين، 29 يونيو)
      try {
        const dayName = now.toLocaleDateString('ar-EG', { weekday: 'long' });
        const dayNum = now.toLocaleDateString('ar-EG', { day: 'numeric' });
        const monthName = now.toLocaleDateString('ar-EG', { month: 'long' });
        setArabicDate(`${dayName}، ${dayNum} ${monthName}`);
      } catch (e) {
        setArabicDate('الإثنين، ٢٩ يونيو');
      }
    };

    updateTimeAndDate();
    const timer = setInterval(updateTimeAndDate, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative border-b border-slate-100 bg-white px-4 md:px-6 py-2 md:py-2.5 shrink-0 flex items-center justify-between z-50">
      
      {/* LEFT SIDE: Status Bar Simulation (Time, Date, Wifi, Battery) */}
      <div className="flex items-center space-x-1.5 md:space-x-4">
        {/* Hardware & Tablet Status Icons */}
        <div className="hidden sm:flex items-center space-x-2 text-slate-700">
          <Wifi className="w-4 h-4 text-slate-800" />
          <Battery className="w-5 h-5 text-slate-800" />
          <span className="text-xs font-mono font-bold text-slate-800">64%</span>
        </div>

        {/* Separator */}
        <div className="hidden sm:block h-4 w-[1px] bg-slate-200"></div>

        {/* Dynamic localized Time and Date */}
        <div className="flex items-center space-x-1.5 md:space-x-2.5">
          <span className="text-xs md:text-sm font-black text-slate-900 tracking-tight font-mono">
            {currentTime}
          </span>
          <span className="text-[10px] md:text-xs font-arabic font-bold text-slate-500 max-w-[80px] sm:max-w-none truncate">
            {arabicDate}
          </span>
        </div>

        {/* Settings Gear Popover Trigger */}
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={`p-1 md:p-1.5 rounded-lg transition-all focus:outline-none relative ${
            isSettingsOpen 
              ? 'bg-slate-100 text-slate-900' 
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
          }`}
          title="إعدادات ومزامنة التابلت"
          id="btn-header-settings"
        >
          <Settings className="w-3.5 h-3.5 md:w-4 md:h-4" />
          {spreadsheetUrl && (
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full border border-white animate-pulse"></span>
          )}
        </button>
      </div>

      {/* RIGHT SIDE: LRT Official Branding */}
      <div className="flex items-center space-x-2 md:space-x-3.5">
        {/* Label and Section Titles */}
        <div className="text-right flex flex-col justify-center">
          <span className="text-[9px] md:text-[11px] font-arabic font-extrabold text-emerald-600 uppercase tracking-widest leading-none">
            دليل التشغيل الرقمي
          </span>
          <h1 className="text-xs md:text-sm font-arabic font-extrabold text-slate-900 mt-0.5 md:mt-1 leading-none">
            القطار الكهربائي الخفيف
          </h1>
        </div>

        {/* Green Subway Button (Goes Home) */}
        <button
          onClick={onGoHome}
          className="w-8 h-8 md:w-10 md:h-10 bg-[#059669] rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-sm hover:bg-[#047857] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#059669]/40"
          title="الرئيسية"
          id="btn-header-subway"
        >
          <Train className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      {/* Embedded Floating Settings & Google Sheets Sync Panel */}
      {isSettingsOpen && (
        <div className="absolute top-[52px] left-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xl w-[360px] md:w-[420px] max-h-[85vh] overflow-y-auto z-50 text-right space-y-4">
          
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-arabic font-black text-slate-900 text-sm flex items-center gap-1.5 flex-row-reverse">
              <Settings className="w-4 h-4 text-[#059669]" />
              <span>إعدادات ومزامنة تابلت السائق</span>
            </h3>
          </div>

          <div className="space-y-4 font-arabic">
            
            {/* SECTION 1: Driver and Train Info */}
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-150">
              <h4 className="text-xs font-black text-slate-700 border-b border-slate-200/60 pb-1.5 mb-2">
                👤 بيانات تابلت السائق
              </h4>
              <div className="grid grid-cols-2 gap-3 text-right">
                {/* Driver Badge Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-extrabold text-slate-500">
                    كود قائد القطار
                  </label>
                  <input 
                    type="text" 
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value.toUpperCase())}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#059669] text-right font-arabic"
                    placeholder="مثال: DRV-4089"
                  />
                </div>

                {/* Vehicle Train ID Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-extrabold text-slate-500">
                    رقم وحدة القطار (LRT)
                  </label>
                  <input 
                    type="text" 
                    value={trainId}
                    onChange={(e) => setTrainId(e.target.value.toUpperCase())}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#059669] text-right font-arabic"
                    placeholder="مثال: TR-012"
                  />
                </div>
              </div>

              {/* Location Select */}
              <div className="space-y-1 text-right mt-1.5">
                <label className="block text-[11px] font-extrabold text-slate-500">
                  موقع القطار الحالي (المحطة)
                </label>
                <select
                  value={trainLocation}
                  onChange={(e) => setTrainLocation(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#059669] text-right font-arabic"
                >
                  <optgroup label="من عدلى منصور حتى العاصمة الإدارية">
                    <option value="محطة عدلى منصور">محطة عدلى منصور</option>
                    <option value="محطة العبور">محطة العبور</option>
                    <option value="المستقبل">المستقبل</option>
                    <option value="الشروق">الشروق</option>
                    <option value="هليوبوليس الجديدة">هليوبوليس الجديدة</option>
                    <option value="بدر">بدر</option>
                    <option value="الروبيكى">الروبيكى</option>
                    <option value="حدائق العاصمة">حدائق العاصمة</option>
                    <option value="مطار العاصمة">مطار العاصمة</option>
                    <option value="مدينة الفنون والثقافة">مدينة الفنون والثقافة</option>
                  </optgroup>
                  <optgroup label="من عدلى منصور حتى مدينة العاشر">
                    <option value="المنطقة الصناعية">المنطقة الصناعية</option>
                    <option value="مدينة المعرفة">مدينة المعرفة</option>
                    <option value="غرب العاشر">غرب العاشر</option>
                    <option value="العاشر من رمضان">العاشر من رمضان</option>
                    <option value="مركز المدينة">مركز المدينة</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* SECTION 2: Google Sheets Synchronization Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3">
              <h4 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-1.5 mb-2 flex items-center justify-end gap-1.5">
                <Cloud className="w-4 h-4 text-emerald-600" />
                <span>ربط ومزامنة Google Sheets</span>
              </h4>

              {sheetsError && (
                <div className="bg-red-50 border border-red-100 text-red-750 text-[11px] p-2.5 rounded-lg text-right">
                  {sheetsError}
                </div>
              )}

              {!googleUser ? (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    قم بربط التطبيق بحساب Google لمزامنة البيانات تلقائياً، وإنشاء صفحات لكل قطار مخصصة وبدء حفظ سجلات الوردية والتشغيل.
                  </p>
                  
                  <button
                    onClick={onGoogleLogin}
                    disabled={isSyncingSheets}
                    type="button"
                    className="w-full flex items-center justify-center space-x-2 space-x-reverse bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-lg py-2 px-3 text-xs font-bold transition-all cursor-pointer"
                  >
                    {isSyncingSheets ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                    ) : (
                      <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                      </svg>
                    )}
                    <span>تسجيل الدخول بحساب Google</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Connected Account */}
                  <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 text-xs text-left">
                    <button
                      onClick={onGoogleLogout}
                      type="button"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-md transition-colors cursor-pointer"
                      title="تسجيل الخروج"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-arabic font-extrabold leading-none">حساب Google النشط:</span>
                      <span className="font-mono font-bold text-slate-700 text-[11px]">{googleUser.email}</span>
                    </div>
                  </div>

                  {/* Connected Sheet */}
                  {spreadsheetUrl ? (
                    <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg space-y-2 text-right">
                      <div>
                        <span className="text-[10px] text-emerald-600 block font-extrabold leading-none mb-1">الملف المربوط والنشط:</span>
                        <span className="text-xs font-black text-slate-800 flex items-center justify-end gap-1.5">
                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                          <span className="truncate">{spreadsheetName || 'سجل تشغيل قطارات LRT'}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={spreadsheetUrl}
                          target="_blank"
                          referrerPolicy="no-referrer"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md py-1.5 text-[11px] font-extrabold transition-all cursor-pointer shadow-sm text-center"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>فتح ورقة العمل ↗</span>
                        </a>

                        <button
                          onClick={onSyncAllHistory}
                          disabled={isSyncingSheets}
                          type="button"
                          className="px-2.5 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 rounded-md text-[11px] transition-all cursor-pointer flex items-center justify-center"
                          title="مزامنة كافة السجلات التاريخية"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSheets ? 'animate-spin text-emerald-600' : ''}`} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-[11px] text-amber-700 bg-amber-50/50 border border-amber-100 p-2.5 rounded-lg leading-relaxed">
                        تم تسجيل الدخول بنجاح! لم يتم ربط ورقة عمل (Google Sheet) بعد. انقر بالأسفل لإنشاء ملف جديد فوراً.
                      </p>

                      <button
                        onClick={onCreateNewSheet}
                        disabled={isSyncingSheets}
                        type="button"
                        className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg py-2 px-4 text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        {isSyncingSheets ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                        )}
                        <span>إنشاء ملف Google Sheet جديد</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>تأكيد الإعدادات والمتابعة</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
