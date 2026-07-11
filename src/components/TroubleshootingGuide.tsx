import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, AnimatePresence 
} from 'motion/react';
import { 
  Search, Wrench, AlertTriangle, HelpCircle, 
  RotateCcw, Sliders, ChevronDown, ChevronUp, Play, 
  Clock, Power, BookOpen, Layers, ShieldCheck, Activity,
  MapPin, Info, Map, Train, Check, ArrowRight, Gauge,
  SlidersHorizontal, Lightbulb, HelpCircle as HelpIcon,
  Volume2, Wind, Flame, RefreshCw, AlertOctagon, ThumbsUp
} from 'lucide-react';

import { 
  MALFUNCTIONS_DATA, 
  SPEED_LIMITS_DATA, 
  CONSOLE_BUTTONS_DATA, 
  CABINET_BREAKERS_DATA,
  Malfunction,
  SpeedLimitItem,
  ConsoleButtonInfo,
  CabinetBreakerInfo
} from '../data/malfunctions';



export default function TroubleshootingGuide() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'index' | 'train_layout' | 'speed_limits' | 'switches_dir'>('index');
  
  // Malfunction State
  const [selectedMalfunction, setSelectedMalfunction] = useState<Malfunction>(MALFUNCTIONS_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean[]>>({});
  const [mobileView, setMobileView] = useState<'index' | 'detail'>('index');
  const [sopViewMode, setSopViewMode] = useState<'checklist' | 'sop_sheet'>('checklist');
  
  // Switch Directory State
  const [switchSearch, setSwitchSearch] = useState('');
  const [switchTab, setSwitchTab] = useState<'all' | 'console' | 'cabinet'>('all');

  // Simulation State
  const [simulationState, setSimulationState] = useState<{
    status: 'idle' | 'running' | 'success';
    secondsLeft: number;
    actionsDone: string[];
    currentStepIndex: number;
  }>({
    status: 'idle',
    secondsLeft: 10,
    actionsDone: [],
    currentStepIndex: 0
  });

  // Custom simulation interactive state variables
  const [batteryActive, setBatteryActive] = useState(true);
  const [pantoActive, setPantoActive] = useState(true);
  const [vcbClosed, setVcbClosed] = useState(true);
  const [reversedState, setReversedState] = useState<'neutral' | 'forward' | 'backward'>('forward');
  const [masterKeyOn, setMasterKeyOn] = useState(true);
  const [b09Isolated, setB09Isolated] = useState(false);
  const [parkingBrakeIsolated, setParkingBrakeIsolated] = useState(false);
  const [pullCordPulled, setPullCordPulled] = useState(false);
  const [eblbBypassed, setEblbBypassed] = useState(false);
  const [doorIsolated, setDoorIsolated] = useState(false);
  const [doorUnlocked, setDoorUnlocked] = useState(false);
  const [acLocalMode, setAcLocalMode] = useState(false);
  const [acMode, setAcMode] = useState<'auto' | 'full' | 'semi' | 'vent'>('auto');
  const [activeBreakers, setActiveBreakers] = useState<Record<string, boolean>>({
    'HMICB': true,
    'PanCB': true,
    'PANUVCB': true,
    'VCBCB': true,
    'WPCB': true,
    'HMLpCB': true,
    'HRUCCB': true,
    'VCUCB': true,
    'SmokCB': true,
    'VTCB1': true,
    'VTCB2': true
  });

  const [toast, setToast] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger brief alert
  const triggerToast = (text: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Reset Simulation when selected malfunction changes
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSimulationState({
      status: 'idle',
      secondsLeft: 10,
      actionsDone: [],
      currentStepIndex: 0
    });
    // Set some defaults based on specific fault to simulate properly
    if (selectedMalfunction.id === 1) {
      setBatteryActive(true);
      setPantoActive(true);
      setVcbClosed(true);
      setMasterKeyOn(true);
    } else if (selectedMalfunction.id === 7) {
      setB09Isolated(false);
    } else if (selectedMalfunction.id === 8) {
      setParkingBrakeIsolated(false);
      setPullCordPulled(false);
      setEblbBypassed(false);
    } else if (selectedMalfunction.id === 9) {
      setDoorIsolated(false);
    } else if (selectedMalfunction.id === 10) {
      setDoorUnlocked(false);
    } else if (selectedMalfunction.id === 12) {
      setAcLocalMode(false);
      setAcMode('auto');
    }
  }, [selectedMalfunction]);

  // Generate detailed SOP metadata dynamically for each malfunction
  const getSopMetadata = (malfunction: Malfunction) => {
    const docCode = `SOP-LRT-M-${malfunction.id.toString().padStart(3, '0')}`;
    const revNo = "REV. 1.3 (يوليو 2026)";
    
    let severity = "متوسطة / تشغيل متدهور (Degraded Mode)";
    if (malfunction.category === 'driving' || malfunction.category === 'pantograph_vcb') {
      severity = "حرجة جداً / تشغيلية (Critical)";
    } else if (malfunction.category === 'power_battery' || malfunction.category === 'brakes') {
      severity = "عالية الخطورة / أمان (High Safety Alarm)";
    } else {
      severity = "عادية / فرعية (Standard/Normal)";
    }

    const confirmations: string[] = [];
    const roles: string[] = [];
    const systems: string[] = [];

    malfunction.steps.forEach((step, idx) => {
      let role = "قائد القطار (Train Driver)";
      let confirm = "تأكيد بصري على شاشة الـ HMI وتغير لون الرمز المعني بالقطار.";
      let system = "نظام المراقبة TCMS";

      const sLower = step.toLowerCase();
      if (sLower.includes("occ") || sLower.includes("إبلاغ") || sLower.includes("تصريح") || sLower.includes("الـ occ") || sLower.includes("بموافقة")) {
        role = "قائد القطار + مراقب OCC";
        confirm = "تلقي التصريح الشفهي أو اللاسلكي المباشر وتسجيل رقم التصريح بالدفتر.";
        system = "الاتصال اللاسلكي Cab Radio";
      } else if (sLower.includes("عزل") || sLower.includes("cut-off") || sLower.includes("b09") || sLower.includes("isolate") || sLower.includes("صنبور")) {
        role = "قائد القطار (يدوياً بالكابينة/العربة)";
        confirm = "تغير حالة الصمام/القاطع ميكانيكياً وسماع تنفيس الهواء الخفيف.";
        system = "عزل الفرامل الميكانيكي";
      } else if (sLower.includes("vcb") || sLower.includes("بانتوجراف") || sLower.includes("panto")) {
        role = "قائد القطار (لوحة كونسول)";
        confirm = "تغير مؤشر فولت الشبكة الهوائية لـ 25 ك.ف عند الرفع أو 0 ك.ف عند الخفض.";
        system = "أنظمة الجهد العالي (High Voltage)";
      } else if (sLower.includes("بطارية") || sLower.includes("battery") || sLower.includes("cutoff") || sLower.includes("active")) {
        role = "قائد القطار (يدوياً بالكابينة)";
        confirm = "إطفاء كامل للشاشات HMI/DMI ثم إعادة تحميل الأنظمة بالتوازي.";
        system = "التغذية والتحكم المساعد (LV)";
      } else if (sLower.includes("فرامل") || sLower.includes("رباط") || sLower.includes("brake") || sLower.includes("طوارئ")) {
        role = "قائد القطار (مباشر)";
        confirm = "ثبات قراءة ضغط هواء اسطوانة الفرامل والعودة لـ 0 بار عند التحرير.";
        system = "نظام التحكم بالمكابح (BCU)";
      } else if (sLower.includes("أبواب") || sLower.includes("door")) {
        role = "قائد القطار (شاشة TCMS)";
        confirm = "تغير لون مؤشر الباب المتأثر للون الأصفر (معزول) أو الرمادي (مغلق).";
        system = "نظام أبواب الركاب (EDCU)";
      } else if (sLower.includes("تكييف") || sLower.includes("ac")) {
        role = "قائد القطار (شاشة TCMS)";
        confirm = "تغير مؤشر مروحة التكييف للون الأزرق أو الرمادي وسماع توقف الصوت بالكابينة.";
        system = "نظام التهوية والتكييف (HVAC)";
      }

      // High-precision custom step overrides for famous faults:
      if (malfunction.id === 1) {
        const resetConfirms = [
          "تأكيد استقرار القطار وثباته عبر عداد ضغط فرامل الخدمة.",
          "تغير حالة مروحة التبريد على الشاشة لتخفيف العبء الكهربائي.",
          "انخفاض قراءة الفولتميتر لـ 0 ك.ف، مع نزول ذراع البانتوجراف ميكانيكياً.",
          "استقرار يد التحكم وعودة مؤشر الاتجاه لقيمة الحياد [0].",
          "سماع صوت إغلاق ريليات الأبواب وتغير لون اللمبة بالكونسول للون الأخضر المستقر.",
          "انطفاء مطبق في كابينة القيادة والـ HMI وتفريغ الشحنات الكهربائية الساكنة.",
          "انتظار انتهاء دورة التفريغ البرمجية للمعالجات.",
          "إضاءة كشافات الطوارئ وبدء دورة الاختبار الذاتي (POST) لأنظمة الـ TCMS.",
          "استقرار قراءات عداد ضغط الفرامل المزدوج (9 بار) وتلاشي كافة الإنذارات العارضة."
        ];
        if (resetConfirms[idx]) confirm = resetConfirms[idx];
      } else if (malfunction.id === 6) {
        const ebConfirms = [
          "تحريك اليد لأقصى رباط خدمة وسماع تأكيد الاستجابة على عداد الضغط.",
          "تحرير ميكانيكي لزر المشروم وارتفاعه ليعود للأعلى.",
          "سماع ريلي تصفير فرامل الطوارئ ومؤشر تفعيل الصمامات.",
          "تحول مؤشر فرامل الطوارئ الأحمر بالكامل للون الرمادي الطبيعي على شاشات الـ DMI و TCMS."
        ];
        if (ebConfirms[idx]) confirm = ebConfirms[idx];
      }

      confirmations.push(confirm);
      roles.push(role);
      systems.push(system);
    });

    return {
      docCode,
      revNo,
      severity,
      confirmations,
      roles,
      systems,
      approvedBy: "الشركة المصرية لإدارة وتشغيل المترو - الإدارة العامة للتشغيل بالقطار الكهربائي"
    };
  };

  // Handle individual step check
  const toggleStepCompleted = (faultId: number, stepIdx: number) => {
    const currentList = completedSteps[faultId] || new Array(selectedMalfunction.steps.length).fill(false);
    const updated = [...currentList];
    updated[stepIdx] = !updated[stepIdx];
    setCompletedSteps({
      ...completedSteps,
      [faultId]: updated
    });

    if (updated[stepIdx]) {
      triggerToast(`تم إنجاز الخطوة ${stepIdx + 1} بنجاح`, 'success');
    }
  };

  // Auto check steps when action is done in simulation
  const advanceSimulationStep = (actionLabel: string, nextStepIdx: number) => {
    setSimulationState(prev => ({
      ...prev,
      actionsDone: [...prev.actionsDone, actionLabel],
      currentStepIndex: nextStepIdx
    }));

    // Auto check corresponding react checkbox
    const currentList = completedSteps[selectedMalfunction.id] || new Array(selectedMalfunction.steps.length).fill(false);
    const updated = [...currentList];
    if (nextStepIdx - 1 >= 0 && nextStepIdx - 1 < updated.length) {
      updated[nextStepIdx - 1] = true;
      setCompletedSteps(prev => ({
        ...prev,
        [selectedMalfunction.id]: updated
      }));
    }
  };

  // Run the final timer countdown
  const startFinalSuccessCountdown = () => {
    setSimulationState(prev => ({ ...prev, status: 'running', secondsLeft: 10 }));
    triggerToast("بدء تصفير الأنظمة وإعادة التشغيل التلقائي... انتظر 10 ثوانٍ", "warning");

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSimulationState(prev => {
        if (prev.secondsLeft <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          triggerToast("تم تصفير العطل بنجاح واستقرار أنظمة القطار 🟢", "success");
          
          // Mark all steps as complete
          const allDone = new Array(selectedMalfunction.steps.length).fill(true);
          setCompletedSteps(prevDone => ({
            ...prevDone,
            [selectedMalfunction.id]: allDone
          }));

          return { ...prev, secondsLeft: 0, status: 'success' };
        }
        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);
  };

  // Filters for malfunctions
  const filteredMalfunctions = MALFUNCTIONS_DATA.filter(fault => {
    const matchesSearch = fault.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          fault.id.toString() === searchQuery.trim();
    const matchesCategory = selectedCategory === 'all' || fault.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getSeverityConfig = (category: string) => {
    switch (category) {
      case 'pantograph_vcb':
      case 'brakes':
        return {
          label: 'عطل حرج',
          badgeBg: 'bg-red-50 text-red-700 border border-red-200/60',
          selectedBadgeBg: 'bg-white/20 text-white border border-white/30',
          dotBg: 'bg-red-500',
          borderClass: 'border-r-4 border-r-red-500',
          bgClass: 'bg-white hover:bg-red-50/10 border-slate-150 hover:border-red-300',
          selectedBgClass: 'bg-red-600 text-white border-red-700 shadow-md scale-[0.98] border-r-4 border-r-red-800'
        };
      case 'driving':
      case 'power_battery':
        return {
          label: 'عطل متوسط',
          badgeBg: 'bg-amber-50 text-amber-700 border border-amber-200/60',
          selectedBadgeBg: 'bg-white/20 text-white border border-white/30',
          dotBg: 'bg-amber-500',
          borderClass: 'border-r-4 border-r-amber-500',
          bgClass: 'bg-white hover:bg-amber-50/10 border-slate-150 hover:border-amber-300',
          selectedBgClass: 'bg-amber-500 text-white border-amber-600 shadow-md scale-[0.98] border-r-4 border-r-amber-700'
        };
      case 'doors_ac_others':
      default:
        return {
          label: 'تحذير',
          badgeBg: 'bg-yellow-50 text-yellow-800 border border-yellow-200/60',
          selectedBadgeBg: 'bg-slate-900/10 text-slate-800 border border-slate-900/20',
          dotBg: 'bg-yellow-400',
          borderClass: 'border-r-4 border-r-yellow-400',
          bgClass: 'bg-white hover:bg-yellow-50/10 border-slate-150 hover:border-yellow-300',
          selectedBgClass: 'bg-yellow-400 text-slate-900 border-yellow-500 shadow-md scale-[0.98] border-r-4 border-r-yellow-500'
        };
    }
  };

  // Filters for switches
  const filteredSwitches = [
    ...CONSOLE_BUTTONS_DATA.map(item => ({ ...item, type: 'console' as const })),
    ...CABINET_BREAKERS_DATA.map(item => ({ ...item, type: 'cabinet' as const }))
  ].filter(sw => {
    const term = switchSearch.toLowerCase();
    const nameMatch = sw.fullName.toLowerCase().includes(term) || (sw as any).nameOnConsole?.toLowerCase().includes(term) || (sw as any).name?.toLowerCase().includes(term);
    const descMatch = (sw as any).functionAr?.toLowerCase().includes(term) || (sw as any).descriptionAr?.toLowerCase().includes(term);
    const tabMatch = switchTab === 'all' || sw.type === switchTab;
    return (nameMatch || descMatch) && tabMatch;
  });

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 text-slate-800 font-sans p-4 md:p-6 pb-28 sm:pb-36" id="troubleshooting-guide-root">
      {/* Navigation Header */}
      <div className="max-w-7xl mx-auto mb-6 bg-white rounded-2xl p-4 shadow-xs border border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-sm shadow-amber-200">
            <Wrench className="w-6 h-6" />
          </div>
          <div className="text-right">
            <h1 className="text-lg font-black text-slate-900 tracking-tight">دليل ومساعد أعطال القطار التفاعلي</h1>
            <p className="text-xs font-medium text-slate-500">طبقا لـ دليل الأعطال الرسمي للـ Capital LRT RDMC</p>
          </div>
        </div>

        {/* Global tab selectors */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setActiveTab('index')}
            className={`px-4 py-2 rounded-lg text-xs font-black cursor-pointer whitespace-nowrap transition-all ${
              activeTab === 'index' 
                ? 'bg-white text-amber-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            دليل ومعالج الأعطال (44 عطل)
          </button>
          <button
            onClick={() => setActiveTab('switches_dir')}
            className={`px-4 py-2 rounded-lg text-xs font-black cursor-pointer whitespace-nowrap transition-all ${
              activeTab === 'switches_dir' 
                ? 'bg-white text-amber-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            فهرس الأزرار والقواطع
          </button>
          <button
            onClick={() => setActiveTab('train_layout')}
            className={`px-4 py-2 rounded-lg text-xs font-black cursor-pointer whitespace-nowrap transition-all ${
              activeTab === 'train_layout' 
                ? 'bg-white text-amber-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            خريطة أماكن القواطع
          </button>
          <button
            onClick={() => setActiveTab('speed_limits')}
            className={`px-4 py-2 rounded-lg text-xs font-black cursor-pointer whitespace-nowrap transition-all ${
              activeTab === 'speed_limits' 
                ? 'bg-white text-amber-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            جدول حدود السرعة
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* TAB 1: TROUBLESHOOTING GUIDE & INDEX */}
        {activeTab === 'index' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Panel: INDEX (فهرس مخصص بأسماء الأعطال فقط) */}
            <div 
              className={`lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col space-y-4 max-h-[820px] text-right ${
                mobileView === 'index' ? 'flex' : 'hidden lg:flex'
              }`}
              id="panel-malfunctions-index"
            >
              <div className="space-y-1 text-right pb-2 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900 flex items-center justify-between">
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">44 عطلاً مسجلاً</span>
                  <span>فهرس دليل الأعطال</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">مكتوب فيه اسم العطل فقط للتسهيل والسرعة</p>
              </div>

              {/* Category selector */}
              <div className="grid grid-cols-3 gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'driving', label: 'الجر' },
                  { id: 'brakes', label: 'الفرامل' },
                  { id: 'pantograph_vcb', label: 'العالي' },
                  { id: 'power_battery', label: 'الطاقة' },
                  { id: 'doors_ac_others', label: 'الخدمات' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`py-1.5 rounded-lg text-[10px] font-black cursor-pointer transition-all ${
                      selectedCategory === cat.id 
                        ? 'bg-amber-500 text-white shadow-xs' 
                        : 'text-slate-500 hover:bg-slate-150 hover:text-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search bar inside the index */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث برقم العطل أو اسم العطل..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs px-3 py-2 pr-9 border border-slate-200 focus:border-amber-500 bg-slate-50 focus:bg-white rounded-xl transition-all outline-none text-right"
                />
                <Search className="absolute right-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
              </div>

              {/* Severity Color Coding Legend */}
              <div className="flex justify-between items-center bg-slate-50 border border-slate-200/60 rounded-xl px-2.5 py-2 text-[9px] font-black text-slate-600 gap-2" dir="rtl">
                <span className="text-slate-400 shrink-0">مستوى الخطورة:</span>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-red-700">حرجة جداً</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-amber-700">متوسطة</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="text-yellow-700">تحذيرية</span>
                </div>
              </div>

              {/* Scrollable list of fault names */}
              <div className="overflow-y-auto space-y-2 pr-1 flex-1 max-h-[580px] scrollbar-thin">
                {filteredMalfunctions.map((fault) => {
                  const isSelected = selectedMalfunction.id === fault.id;
                  const stepsCount = fault.steps.length;
                  const checkedCount = (completedSteps[fault.id] || []).filter(Boolean).length;
                  const isFinished = checkedCount === stepsCount;
                  const sev = getSeverityConfig(fault.category);

                  return (
                    <button
                      key={fault.id}
                      onClick={() => {
                        setSelectedMalfunction(fault);
                        setMobileView('detail');
                      }}
                      className={`w-full text-right p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center gap-2 ${
                        isSelected 
                          ? sev.selectedBgClass 
                          : `${sev.bgClass} text-slate-800 shadow-xs`
                      }`}
                    >
                      {/* Left: Progress/Page info & Severity Badge */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                          isSelected ? sev.selectedBadgeBg : sev.badgeBg
                        }`}>
                          {sev.label}
                        </span>

                        {isFinished ? (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                            مكتمل ✓
                          </span>
                        ) : checkedCount > 0 ? (
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                            {checkedCount}/{stepsCount}
                          </span>
                        ) : (
                          <span className={`text-[9px] font-mono font-bold ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                            {fault.pageRef.split(' ')[0]}
                          </span>
                        )}
                      </div>

                      {/* Right: ID & Title */}
                      <div className="flex-1 text-right pl-2">
                        <span className="text-xs font-black leading-snug block">
                          {fault.id}. {fault.titleAr}
                        </span>
                      </div>
                    </button>
                  );
                })}

                {filteredMalfunctions.length === 0 && (
                  <div className="text-center py-12 text-xs text-slate-400">
                    لا توجد نتائج تطابق بحثك. جرب كلمة أخرى أو اختر تصنيفاً آخراً.
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Detailed Fault troubleshooting and simulation */}
            <div 
              className={`lg:col-span-8 space-y-6 ${
                mobileView === 'detail' ? 'block' : 'hidden lg:block'
              }`}
              id="panel-malfunction-details"
            >
              {/* Back to Index Button - Elegant, responsive top bar */}
              <div className="lg:hidden flex justify-between items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs" id="detail-header-back-bar">
                <button
                  onClick={() => {
                    setMobileView('index');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-xs shadow-sm transition-all cursor-pointer border border-amber-600"
                  id="btn-back-to-index"
                >
                  <ArrowRight className="w-4 h-4 text-white" />
                  <span>العودة لفهرس الأعطال واختيار عطل آخر</span>
                </button>

                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-slate-400 font-black block">العطل المعروض حالياً</span>
                  <span className="text-xs font-extrabold text-slate-800">{selectedMalfunction.id}. {selectedMalfunction.titleAr}</span>
                </div>
              </div>

              {/* Step-by-Step interactive checklist */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-6 text-right relative overflow-hidden font-arabic" id="sop-checklist-container">
                {/* Watermark/Stamp for authentic SOP Look in background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] rotate-12 select-none">
                  <span className="text-7xl font-black font-mono border-8 border-amber-600 p-4 rounded-3xl text-amber-600 block text-center">
                    APPROVED SOP
                  </span>
                  <span className="text-xl font-bold text-slate-800 text-center block mt-2">
                    الشركة المصرية لتشغيل المترو
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row-reverse justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
                  {/* Right: Title and ID */}
                  <div className="text-right">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border mb-1.5 inline-block ${getSeverityConfig(selectedMalfunction.category).badgeBg}`}>
                      {getSeverityConfig(selectedMalfunction.category).label} - {selectedMalfunction.categoryAr}
                    </span>
                    <h2 className="text-md font-black text-slate-900 flex items-center justify-end gap-2">
                      {selectedMalfunction.id}. {selectedMalfunction.titleAr}
                      <BookOpen className="w-5 h-5 text-amber-500" />
                    </h2>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">{selectedMalfunction.titleEn}</p>
                    {selectedMalfunction.pageRef && (
                      <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full mt-1 inline-block">
                        كتالوج: {selectedMalfunction.pageRef}
                      </span>
                    )}
                  </div>

                  {/* Left: Reset progress button */}
                  <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    <button 
                      onClick={() => {
                        setCompletedSteps({
                          ...completedSteps,
                          [selectedMalfunction.id]: new Array(selectedMalfunction.steps.length).fill(false)
                        });
                        triggerToast("تمت إعادة تصفير تقدم الخطوات", "info");
                      }}
                      className="text-[10px] text-slate-500 hover:text-amber-600 font-black flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 cursor-pointer focus:outline-none"
                    >
                      إعادة ضبط <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-1">
                    قم باتباع الخطوات التالية واحدة تلو الأخرى لحل العطل وتحييد قواطع التيار المعنية بالقطار:
                  </p>
                  {selectedMalfunction.steps.map((step, idx) => {
                    const isDone = !!(completedSteps[selectedMalfunction.id]?.[idx]);
                    return (
                      <div 
                        key={idx}
                        onClick={() => toggleStepCompleted(selectedMalfunction.id, idx)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex gap-3 items-start justify-end ${
                          isDone 
                            ? 'bg-emerald-50/50 border-emerald-200/80 text-slate-600' 
                            : 'bg-white border-slate-150 hover:border-amber-300 hover:bg-amber-50/5 text-slate-800 shadow-xs'
                        }`}
                      >
                        <div className="text-right flex-1 space-y-1">
                          <span className={`text-[10px] font-black block ${isDone ? 'text-emerald-700' : 'text-slate-800'}`}>
                            الخطوة {idx + 1}
                          </span>
                          <p className={`text-xs leading-relaxed font-bold ${isDone ? 'line-through text-slate-400 font-medium' : 'text-slate-800'}`}>
                            {step}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isDone ? 'bg-emerald-500 border-emerald-600 text-white' : 'border-slate-300'
                        }`}>
                          {isDone && <Check className="w-3.5 h-3.5 font-bold" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>



              {/* Interactive Simulation Dashboard (تصفير العطل تفاعلياً) - Hiding as requested */}
              {false && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 space-y-4 text-right">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      simulationState.status === 'success' ? 'bg-emerald-100 text-emerald-800' :
                      simulationState.status === 'running' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {simulationState.status === 'success' ? 'تم الحل بنجاح ✓' :
                       simulationState.status === 'running' ? `جاري التصفير: ${simulationState.secondsLeft} ثوان` :
                       'جاهز للمحاكاة'}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    محاكي تصفير وإصلاح العطل التفاعلي ⚡
                    <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
                  </h3>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  اتبع التوجيهات واضغط على الأزرار الافتراضية للقطار بالأسفل لمحاكاة خطوات إزالة وتصفير هذا العطل بنجاح.
                </p>

                {/* DYNAMIC INTERACTIVE IMAGES/PANELS BASED ON 'imageType' */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 min-h-[160px] flex flex-col items-center justify-center relative overflow-hidden">
                  
                  {/* TYPE A: CONSOLE */}
                  {selectedMalfunction.imageType === 'console' && (
                    <div className="w-full max-w-md space-y-3">
                      <span className="text-[10px] font-black text-slate-400 block text-center">لوحة التحكم وكاميرا الكابينة (Console Layout)</span>
                      
                      <div className="grid grid-cols-4 gap-2">
                        <button
                          onClick={() => {
                            setBatteryActive(false);
                            advanceSimulationStep('Battery Cutoff Pressed', 1);
                          }}
                          className={`p-2 rounded border text-[10px] font-black transition-all cursor-pointer ${
                            !batteryActive ? 'bg-red-500 text-white border-red-600' : 'bg-white hover:bg-slate-100'
                          }`}
                        >
                          BATTERY OFF (عزل)
                        </button>
                        <button
                          onClick={() => {
                            setBatteryActive(true);
                            advanceSimulationStep('Battery Active Pressed', 2);
                          }}
                          className={`p-2 rounded border text-[10px] font-black transition-all cursor-pointer ${
                            batteryActive ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white hover:bg-slate-100'
                          }`}
                        >
                          BATTERY ON (تنشيط)
                        </button>
                        <button
                          onClick={() => {
                            setPantoActive(false);
                            advanceSimulationStep('Panto Down Pressed', 3);
                          }}
                          className={`p-2 rounded border text-[10px] font-black transition-all cursor-pointer ${
                            !pantoActive ? 'bg-blue-600 text-white border-blue-700' : 'bg-white hover:bg-slate-100'
                          }`}
                        >
                          PANTO DOWN
                        </button>
                        <button
                          onClick={() => {
                            setPantoActive(true);
                            advanceSimulationStep('Panto Up Pressed', 4);
                          }}
                          className={`p-2 rounded border text-[10px] font-black transition-all cursor-pointer ${
                            pantoActive ? 'bg-amber-500 text-white border-amber-600' : 'bg-white hover:bg-slate-100'
                          }`}
                        >
                          PANTO UP
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        <button
                          onClick={() => {
                            setVcbClosed(false);
                            advanceSimulationStep('VCB Opened', 5);
                          }}
                          className={`p-2 rounded border text-[10px] font-black transition-all cursor-pointer ${
                            !vcbClosed ? 'bg-red-600 text-white border-red-700' : 'bg-white hover:bg-slate-100'
                          }`}
                        >
                          VCB OPEN (فصل)
                        </button>
                        <button
                          onClick={() => {
                            setVcbClosed(true);
                            advanceSimulationStep('VCB Closed', 6);
                          }}
                          className={`p-2 rounded border text-[10px] font-black transition-all cursor-pointer ${
                            vcbClosed ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white hover:bg-slate-100'
                          }`}
                        >
                          VCB CLOSE (توصيل)
                        </button>
                        <button
                          onClick={() => {
                            setMasterKeyOn(!masterKeyOn);
                            advanceSimulationStep('Master Key Toggled', 7);
                          }}
                          className={`p-2 rounded border text-[10px] font-black transition-all cursor-pointer ${
                            masterKeyOn ? 'bg-amber-600 text-white' : 'bg-white hover:bg-slate-100'
                          }`}
                        >
                          مفتاح رئيسي: {masterKeyOn ? 'ON' : 'OFF'}
                        </button>
                        <button
                          onClick={() => {
                            const nextDir = reversedState === 'neutral' ? 'forward' : 'neutral';
                            setReversedState(nextDir);
                            advanceSimulationStep('Reverser Switch Turned', 8);
                          }}
                          className="p-2 rounded border bg-white hover:bg-slate-100 text-[10px] font-black cursor-pointer"
                        >
                          اتجاه: {reversedState === 'forward' ? 'أمامي' : 'مطفأ [0]'}
                        </button>
                      </div>

                      <div className="pt-2 text-center">
                        <button
                          onClick={startFinalSuccessCountdown}
                          disabled={simulationState.status === 'running'}
                          className="w-full bg-slate-900 text-white py-2 rounded-lg text-xs font-black hover:bg-amber-500 hover:text-white transition-all cursor-pointer"
                        >
                          تشغيل دورة تصفير البطاريات وإعادة تفعيلها (30 ثانية) 🔄
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TYPE B: TCMS INTERACTION */}
                  {(selectedMalfunction.imageType === 'tcms_traction' || 
                    selectedMalfunction.imageType === 'tcms_overcurrent' || 
                    selectedMalfunction.imageType === 'tcms_equipment') && (
                    <div className="w-full max-w-md bg-slate-950 text-emerald-400 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-3">
                      <div className="flex justify-between border-b border-emerald-900 pb-1.5 text-[9px]">
                        <span>VEHICLE STABILITY CONTROL - ACTIVE</span>
                        <span>شاشة الـ TCMS الذكية</span>
                      </div>
                      
                      <div className="space-y-1 text-right">
                        <p className="text-white text-[10px]">العطل الحالي: <span className="text-amber-400 font-bold">{selectedMalfunction.titleAr}</span></p>
                        <p className="text-[10px] text-slate-400">العربة المتأثرة: Car 2 & Car 5 (Motor Cars)</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {selectedMalfunction.imageType === 'tcms_traction' && (
                          <button
                            onClick={() => {
                              advanceSimulationStep('Traction Reset Clicked', 1);
                              startFinalSuccessCountdown();
                            }}
                            className="bg-emerald-900 border border-emerald-500 text-emerald-100 p-2 rounded text-center font-black cursor-pointer hover:bg-emerald-800 transition-all text-[11px]"
                          >
                            [Traction & Charger Reset] تصفير الجر الشاحن
                          </button>
                        )}
                        {selectedMalfunction.imageType === 'tcms_overcurrent' && (
                          <button
                            onClick={() => {
                              advanceSimulationStep('Overcurrent Reset Clicked', 1);
                              startFinalSuccessCountdown();
                            }}
                            className="bg-amber-950 border border-amber-600 text-amber-200 p-2 rounded text-center font-black cursor-pointer hover:bg-amber-900 transition-all text-[11px]"
                          >
                            [Overcurrent Reset] تصفير التيار الزائد
                          </button>
                        )}
                        {selectedMalfunction.imageType === 'tcms_equipment' && (
                          <>
                            <button
                              onClick={() => {
                                advanceSimulationStep('Equipment Cut-Off Clicked', 1);
                                triggerToast("تم عزل المعدة المعطلة برمجياً", "warning");
                              }}
                              className="bg-red-950 border border-red-700 text-red-200 p-2 rounded text-center font-black cursor-pointer hover:bg-red-900 transition-all text-[10px]"
                            >
                              [Cut-Off] عزل المعدة المتأثرة
                            </button>
                            <button
                              onClick={() => {
                                advanceSimulationStep('Equipment Reset Clicked', 2);
                                startFinalSuccessCountdown();
                              }}
                              className="bg-emerald-950 border border-emerald-700 text-emerald-200 p-2 rounded text-center font-black cursor-pointer hover:bg-emerald-900 transition-all text-[10px]"
                            >
                              [Reset] استعادة وتصفير
                            </button>
                          </>
                        )}
                        
                        <div className="bg-slate-900/50 p-2 rounded border border-slate-800 flex flex-col justify-center items-center">
                          <span className="text-[8px] text-slate-500">حالة الإشارات</span>
                          <span className="text-[10px] text-emerald-400 font-bold">ONLINE ✓</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TYPE C: CIRCUIT BREAKER BOX PANEL */}
                  {selectedMalfunction.imageType === 'cb_panel' && (
                    <div className="w-full max-w-sm space-y-3">
                      <span className="text-[10px] font-black text-slate-400 block text-center">لوحة قواطع كابينة القيادة (Circuit Breakers Box)</span>
                      
                      <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-xs grid grid-cols-3 gap-3">
                        {selectedMalfunction.breakers.map(cbName => {
                          const isUp = activeBreakers[cbName] !== false;
                          return (
                            <div key={cbName} className="flex flex-col items-center p-2 bg-slate-50 rounded border border-slate-200">
                              <span className="font-mono text-[10px] font-black text-slate-700">{cbName}</span>
                              
                              <button
                                onClick={() => {
                                  const nextState = !isUp;
                                  setActiveBreakers({
                                    ...activeBreakers,
                                    [cbName]: nextState
                                  });
                                  advanceSimulationStep(`Breaker ${cbName} toggled to ${nextState ? 'UP' : 'DOWN'}`, 1);
                                  
                                  // If turned off then on, trigger success
                                  if (!nextState) {
                                    triggerToast(`تم خفض القاطع ${cbName} بنجاح`, 'warning');
                                  } else {
                                    triggerToast(`تم إعادة رفع القاطع ${cbName} للتصفير`, 'success');
                                    startFinalSuccessCountdown();
                                  }
                                }}
                                className={`w-8 h-12 rounded mt-2 flex flex-col justify-between p-1 transition-all border cursor-pointer ${
                                  isUp ? 'bg-emerald-100 border-emerald-300' : 'bg-red-100 border-red-300'
                                }`}
                              >
                                <div className={`w-6 h-4 rounded-sm ${isUp ? 'bg-emerald-500 self-start' : 'bg-slate-300'}`} />
                                <div className={`w-6 h-4 rounded-sm ${!isUp ? 'bg-red-500 self-end' : 'bg-slate-300'}`} />
                              </button>
                              
                              <span className="text-[8px] text-slate-400 font-bold mt-1">
                                {isUp ? 'مرفوع ON' : 'مفصول OFF'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TYPE D: AIR BRAKE ISOLATION B09 */}
                  {selectedMalfunction.imageType === 'air_brake' && (
                    <div className="w-full max-w-sm space-y-3 text-center">
                      <span className="text-[10px] font-black text-slate-400 block">بلف عزل فرامل الهواء B09 أسفل المقعد الخماسي</span>
                      
                      <div className="flex flex-col items-center space-y-2">
                        {/* Interactive Rotating Valve graphic */}
                        <div 
                          onClick={() => {
                            const nextState = !b09Isolated;
                            setB09Isolated(nextState);
                            advanceSimulationStep(nextState ? 'B09 Isolated' : 'B09 Open', 1);
                            if (nextState) {
                              triggerToast("تم تدوير الصمام للوضع العمودي وعزل فرامل العربة", "success");
                              startFinalSuccessCountdown();
                            }
                          }}
                          className="w-16 h-16 bg-slate-200 border-2 border-slate-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-300 transition-all"
                        >
                          <motion.div 
                            animate={{ rotate: b09Isolated ? 90 : 0 }}
                            className="w-12 h-3 bg-red-600 rounded shadow-xs"
                          />
                        </div>

                        <span className="text-[11px] font-black text-slate-700">
                          حالة بلف عزل الفرامل: <span className={b09Isolated ? "text-red-600" : "text-emerald-600"}>{b09Isolated ? "معزول (عمودي)" : "مفتوح بالخدمة (أفقي)"}</span>
                        </span>

                        <p className="text-[10px] text-slate-400">
                          اضغط على صمام B09 الدائري بالأعلى لتدوير المقبض ومحاكاة العزل الميكانيكي الفوري.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TYPE E: PARKING BRAKE RELEASE */}
                  {selectedMalfunction.imageType === 'parking_brake' && (
                    <div className="w-full max-w-md space-y-3 text-center">
                      <span className="text-[10px] font-black text-slate-400 block">عزل فرامل الانتظار (صمام B01 + حبل التحرير اليدوي السفلي + EBLB)</span>
                      
                      <div className="grid grid-cols-3 gap-3">
                        {/* B01.07 valve */}
                        <div 
                          onClick={() => {
                            setParkingBrakeIsolated(!parkingBrakeIsolated);
                            advanceSimulationStep('B01.07 Isolated', 1);
                            triggerToast("تم غلق صمام إمداد الهواء لفرامل الانتظار", "warning");
                          }}
                          className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                            parkingBrakeIsolated ? 'bg-red-50 border-red-300' : 'bg-white hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-[9px] text-slate-400 block">خطوة 1: صمام B01.07</span>
                          <span className="text-xs font-black block mt-1">
                            {parkingBrakeIsolated ? 'معزول 🔴' : 'اضغط للعزل 🔄'}
                          </span>
                        </div>

                        {/* Pull cord */}
                        <div 
                          onClick={() => {
                            if (!parkingBrakeIsolated) {
                              triggerToast("يجب عزل بلف B01.07 أولاً قبل سحب الحبل!", "warning");
                              return;
                            }
                            setPullCordPulled(true);
                            advanceSimulationStep('Pull Cord Pulled', 2);
                            triggerToast("تم سحب حبل التحرير وتفريغ هواء السوستة بنجاح", "success");
                          }}
                          className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                            pullCordPulled ? 'bg-emerald-50 border-emerald-300' : 'bg-white hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-[9px] text-slate-400 block">خطوة 2: حبل التحرير السفلي</span>
                          <span className="text-xs font-black block mt-1">
                            {pullCordPulled ? 'مسحوب ومفرّغ ✓' : 'اضغط للسحب ⚓'}
                          </span>
                        </div>

                        {/* EBLB switch */}
                        <div 
                          onClick={() => {
                            if (!pullCordPulled) {
                              triggerToast("يجب إكمال عزل الصمام وسحب الحبل أولاً!", "warning");
                              return;
                            }
                            setEblbBypassed(true);
                            advanceSimulationStep('EBLB Bypassed', 3);
                            startFinalSuccessCountdown();
                          }}
                          className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                            eblbBypassed ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-[9px] text-slate-400 block">خطوة 3: تجاوز EBLB</span>
                          <span className="text-xs font-black block mt-1">
                            {eblbBypassed ? 'تم التجاوز 🟢' : 'اضغط للتجاوز ⚡'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TYPE F: DOOR ISOLATION KEY */}
                  {selectedMalfunction.imageType === 'door_isolation' && (
                    <div className="w-full max-w-sm space-y-3 text-center">
                      <span className="text-[10px] font-black text-slate-400 block">قفل عزل باب الصالون الدائري باستخدام المفتاح المربع للقصاصين</span>
                      
                      <div className="flex flex-col items-center space-y-2">
                        <button
                          onClick={() => {
                            const nextState = !doorIsolated;
                            setDoorIsolated(nextState);
                            advanceSimulationStep(nextState ? 'Door Isolated' : 'Door Normal', 1);
                            if (nextState) {
                              triggerToast("تم غلق الباب يدوياً وتدوير القفل المربع بنجاح", "success");
                              startFinalSuccessCountdown();
                            }
                          }}
                          className={`w-14 h-14 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                            doorIsolated ? 'bg-red-600 border-red-700 text-white' : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                          }`}
                        >
                          <SlidersHorizontal className="w-6 h-6" />
                        </button>

                        <span className="text-xs font-black text-slate-800">
                          حالة قفل العزل المربع للباب: <span className={doorIsolated ? 'text-red-600' : 'text-slate-500'}>{doorIsolated ? 'معزول [ISOLATED]' : 'عادي بالخدمة'}</span>
                        </span>

                        <div className="flex justify-center gap-2 pt-1">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded ${doorIsolated ? 'bg-red-500 text-white' : 'bg-slate-200'}`}>
                            المؤشر الأحمر: {doorIsolated ? 'مستضيء' : 'مطفأ'}
                          </span>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded ${doorIsolated ? 'bg-blue-500 text-white' : 'bg-slate-200'}`}>
                            على شاشة TCMS: {doorIsolated ? 'أزرق (معزول)' : 'أحمر (عطل)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TYPE G: EMERGENCY DOOR HANDLE */}
                  {selectedMalfunction.imageType === 'emergency_door' && (
                    <div className="w-full max-w-sm space-y-3 text-center">
                      <span className="text-[10px] font-black text-slate-400 block">يد فتح الطوارئ الحمراء لفتح الباب يدوياً من الداخل</span>
                      
                      <div className="flex flex-col items-center space-y-2">
                        <button
                          onClick={() => {
                            const nextState = !doorUnlocked;
                            setDoorUnlocked(nextState);
                            advanceSimulationStep(nextState ? 'Emergency Handle Pulled' : 'Emergency Handle Reset', 1);
                            if (nextState) {
                              triggerToast("تم سحب يد الطوارئ وفتح مصراعي الباب يدوياً بقوة", "success");
                              startFinalSuccessCountdown();
                            }
                          }}
                          className={`px-6 py-3 rounded-xl font-black text-xs transition-all cursor-pointer ${
                            doorUnlocked ? 'bg-red-600 hover:bg-red-700 text-white shadow-md' : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-800'
                          }`}
                        >
                          {doorUnlocked ? 'اليد في وضع الفتح [PULLED] 🔴' : 'اضغط لسحب يد الطوارئ الحمراء 🔄'}
                        </button>

                        <p className="text-[10px] text-slate-400">
                          تحذير: سحب اليد يفقد القطار طاقة الجر فوراً ويغير لون الباب للون الرمادي بشاشة الـ TCMS.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TYPE H: DIRECT EMERGENCY TRACTION MODE (ETM PANEL) */}
                  {selectedMalfunction.imageType === 'etm_switch' && (
                    <div className="w-full max-w-md space-y-3">
                      <span className="text-[10px] font-black text-slate-400 block text-center">لوحة تحكم الطوارئ (Emergency Control Panel خلف السائق)</span>
                      
                      <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-xs grid grid-cols-2 gap-4">
                        {/* VCUCB breaker toggle */}
                        <div className="flex flex-col items-center p-2 bg-slate-50 rounded border border-slate-200">
                          <span className="font-mono text-[9px] font-black text-slate-700">قاطع VCUCB</span>
                          <button
                            onClick={() => {
                              const nextState = !activeBreakers['VCUCB'];
                              setActiveBreakers({ ...activeBreakers, VCUCB: nextState });
                              advanceSimulationStep(`VCUCB toggled to ${nextState ? 'UP' : 'DOWN'}`, 1);
                              triggerToast(nextState ? "تم رفع قاطع VCU للتشغيل" : "تم خفض قاطع VCU لعزل النظام", "warning");
                            }}
                            className={`px-4 py-1.5 rounded text-[10px] font-black text-white mt-1.5 transition-all cursor-pointer ${
                              activeBreakers['VCUCB'] ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                          >
                            {activeBreakers['VCUCB'] ? 'مرفوع ON' : 'مفصول OFF'}
                          </button>
                        </div>

                        {/* ETM Rotary Switch */}
                        <div className="flex flex-col items-center p-2 bg-slate-50 rounded border border-slate-200">
                          <span className="text-[9px] font-black text-slate-700">مفتاح ETM الدوار</span>
                          <button
                            onClick={() => {
                              advanceSimulationStep('ETM Mode Active', 2);
                              triggerToast("تم تنشيط نظام الجر الطارئ المباشر ETM بنجاح", "success");
                              startFinalSuccessCountdown();
                            }}
                            className="bg-amber-500 text-white font-black text-[10px] px-3 py-1.5 rounded mt-1.5 hover:bg-amber-600 transition-all cursor-pointer"
                          >
                            تدوير لوضع [ETM]
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TYPE I: LOCAL AC CONTROL SMART LINE */}
                  {selectedMalfunction.imageType === 'smart_line_ac' && (
                    <div className="w-full max-w-md bg-slate-900 text-white p-4 rounded-xl border border-slate-800 text-xs space-y-3">
                      <div className="flex justify-between border-b border-slate-800 pb-1 text-[9px] text-slate-400">
                        <span>SMART-LINE AC THERMOSTAT</span>
                        <span>شاشة تحكم الصالون للتكييف</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        {/* Network vs Local toggle */}
                        <div className="space-y-1">
                          <span className="text-[8px] text-slate-400 block text-right">مصدر التحكم الحالي</span>
                          <button
                            onClick={() => {
                              const nextState = !acLocalMode;
                              setAcLocalMode(nextState);
                              advanceSimulationStep(nextState ? 'AC Local Mode' : 'AC Network Mode', 1);
                              triggerToast(nextState ? "تم التحويل للتحكم المحلي بالتكييف" : "تم الإرجاع لوضع الشبكة الأوتوماتيكي", "info");
                            }}
                            className={`w-full py-2 px-2 rounded font-black text-[10px] transition-all cursor-pointer ${
                              acLocalMode ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {acLocalMode ? 'تحكم محلي [Local]' : 'شبكة أوتوماتيك [Network]'}
                          </button>
                        </div>

                        {/* Mode selectors */}
                        <div className="space-y-1">
                          <span className="text-[8px] text-slate-400 block text-right">اختر نمط التبريد اليدوي</span>
                          <div className="grid grid-cols-2 gap-1">
                            <button
                              onClick={() => {
                                if (!acLocalMode) {
                                  triggerToast("يجب التحويل لوضع Local أولاً!", "warning");
                                  return;
                                }
                                setAcMode('full');
                                advanceSimulationStep('AC Full-Cooling', 2);
                                triggerToast("تم تفعيل نمط التبريد الكامل", "success");
                                startFinalSuccessCountdown();
                              }}
                              className={`p-1.5 rounded text-[8px] font-black transition-all cursor-pointer ${
                                acMode === 'full' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              تبريد كامل
                            </button>
                            <button
                              onClick={() => {
                                if (!acLocalMode) {
                                  triggerToast("يجب التحويل لوضع Local أولاً!", "warning");
                                  return;
                                }
                                setAcMode('semi');
                                advanceSimulationStep('AC Semi-Cooling', 3);
                                triggerToast("تم تفعيل التبريد النصفي", "success");
                                startFinalSuccessCountdown();
                              }}
                              className={`p-1.5 rounded text-[8px] font-black transition-all cursor-pointer ${
                                acMode === 'semi' ? 'bg-blue-400 text-white' : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              تبريد نصفي
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TYPE J: GENERIC CHASSIS OR CATENARY SCHEMATICS */}
                  {(selectedMalfunction.imageType === 'speed_sensor' || 
                    selectedMalfunction.imageType === 'catenary_chart') && (
                    <div className="w-full max-w-sm space-y-3 text-center">
                      <span className="text-[10px] font-black text-slate-400 block">تخطيط السكة والشبكة الهوائية العلوية (Catenary 25kV & Wheels)</span>
                      
                      <div className="flex flex-col items-center space-y-2">
                        {selectedMalfunction.imageType === 'catenary_chart' ? (
                          <div className="relative w-48 h-16 bg-slate-200 rounded border border-slate-300 flex items-center justify-center">
                            {/* Visual representation of overhead line and panto contact */}
                            <div className="absolute top-2 left-0 right-0 h-1 bg-amber-500" />
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 border-t-2 border-l-2 border-r-2 border-slate-600 rounded-t" />
                            <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded z-10">25,000V Normal 🟢</span>
                          </div>
                        ) : (
                          <div className="relative w-48 h-16 bg-slate-200 rounded border border-slate-300 flex items-center justify-center gap-6">
                            {/* Wheels graphic */}
                            <div className="w-10 h-10 rounded-full border-4 border-slate-700 bg-slate-500 animate-spin flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                            <div className="w-10 h-10 rounded-full border-4 border-slate-700 bg-slate-500 animate-spin flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                            <span className="text-[10px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Speed: 80 km/h</span>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            advanceSimulationStep('Sensor/Catenary Inspected', 1);
                            startFinalSuccessCountdown();
                          }}
                          className="bg-slate-900 text-white font-black text-xs px-4 py-2 rounded-lg hover:bg-amber-500 transition-all cursor-pointer"
                        >
                          تأكيد الفحص واستقرار التغذية ⚡
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SUCCESS CELEBRATION OVERLAY */}
                  {simulationState.status === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center text-center p-4 z-10"
                    >
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                        <Check className="w-6 h-6 stroke-[3]" />
                      </div>
                      <h4 className="text-xs font-black text-slate-900">تم تصفير العطل بنجاح واستقرار أنظمة القطار 🟢</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">القواطع في وضع الخدمة ومستعد للانطلاق الفوري.</p>
                      
                      <button 
                        onClick={() => {
                          setSimulationState({
                            status: 'idle',
                            secondsLeft: 10,
                            actionsDone: [],
                            currentStepIndex: 0
                          });
                        }}
                        className="mt-3 text-[10px] bg-slate-100 px-3 py-1.5 rounded-lg font-black hover:bg-slate-200 transition-all cursor-pointer"
                      >
                        إعادة تشغيل المحاكاة 🔄
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Instruction tips */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 flex gap-2 items-start justify-end text-right">
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] font-black text-slate-700 block">دليل المحاكاة السريع لقائد القطار:</span>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      عند التفاعل مع الأزرار بالأعلى، ستتحقق الخطوات المقابلة لها تلقائياً في قائمة الفحص بالأعلى. استخدم المحاكي للتأكد من تذكرك لموقع وتسميات قواطع وأزرار الكابينة الموزعة.
                    </p>
                  </div>
                  <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                </div>
              </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 2: COMPREHENSIVE INTERACTIVE SWITCHES DIRECTORY */}
        {activeTab === 'switches_dir' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-6 text-right">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <h2 className="text-md font-black text-slate-900 flex items-center justify-end gap-2">
                  دليل وتسميات مفاتيح وقواطع القطار بالتفصيل
                  <Sliders className="w-5 h-5 text-amber-500" />
                </h2>
                <p className="text-xs text-slate-500">
                  قائمة شاملة بجميع المفاتيح الموجودة بالملف، مع توضيح عملها ووظائفها بالتفصيل.
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ابحث باسم المفتاح أو وظيفته..."
                    value={switchSearch}
                    onChange={(e) => setSwitchSearch(e.target.value)}
                    className="w-full sm:w-64 text-xs px-3.5 py-2 pr-9 bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 rounded-xl outline-none text-right"
                  />
                  <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>

                <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setSwitchTab('all')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black cursor-pointer ${
                      switchTab === 'all' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    الكل
                  </button>
                  <button
                    onClick={() => setSwitchTab('console')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black cursor-pointer ${
                      switchTab === 'console' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    أزرار الكونسول
                  </button>
                  <button
                    onClick={() => setSwitchTab('cabinet')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black cursor-pointer ${
                      switchTab === 'cabinet' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    قواطع اللوحة
                  </button>
                </div>
              </div>
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSwitches.map((sw, index) => {
                const isConsole = sw.type === 'console';
                return (
                  <div 
                    key={index}
                    className="p-4 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-slate-150 flex flex-col justify-between space-y-3 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          isConsole ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isConsole ? 'مفتاح كونسول كابينة' : 'قاطع لوحة DC / AC'}
                        </span>
                        <span className="font-mono text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {isConsole ? (sw as any).nameOnConsole : (sw as any).name}
                        </span>
                      </div>
                      
                      <p className="text-xs font-black text-slate-800 pt-1">
                        {isConsole ? (sw as any).functionAr : (sw as any).descriptionAr}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/50 text-[10px] text-slate-400 font-bold flex justify-between items-center">
                      <span>{isConsole ? (sw as any).fullName : (sw as any).fullName}</span>
                      <span className="font-mono text-slate-500">[{isConsole ? (sw as any).abbr : (sw as any).name}]</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: INTERACTIVE DISTRIBUTION MAP */}
        {activeTab === 'train_layout' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-6 text-right">
            <div className="space-y-1">
              <h2 className="text-md font-black text-slate-900 flex items-center justify-end gap-2">
                توزيع كبائن قواطع ومفاتيح القطار (Distributed Cabinets Map)
                <Map className="w-5 h-5 text-amber-500" />
              </h2>
              <p className="text-xs text-slate-500">
                تنبيه: قواطع القطار ومفاتيح الأمان ليست في كابينة واحدة. يوضح المخطط بالأسفل توزيع القواطع على كبائن القيادة وعربات الصالون المختلفة.
              </p>
            </div>

            {/* Train Visual Scheme */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-150 overflow-x-auto">
              <div className="min-w-[900px] flex items-center justify-center gap-2 py-6">
                
                {/* CAB 1 */}
                <div className="w-40 h-28 bg-white border-2 border-amber-500 rounded-r-3xl rounded-l-md p-3 relative flex flex-col justify-between shadow-xs">
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-tr-2xl rounded-bl-md">
                    موقع كابينة القيادة 1
                  </div>
                  <div className="pt-5 text-right">
                    <p className="text-xs font-black text-slate-800">كابينة القيادة 1</p>
                    <p className="text-[9px] text-slate-500 leading-relaxed">أزرار الكونسول، قواطع الإشارات، قواطع HMICB، السرينة والمساحات.</p>
                  </div>
                </div>

                {/* Connector */}
                <div className="w-4 h-6 bg-slate-300 rounded" />

                {/* CAR 2 */}
                <div className="w-36 h-28 bg-white border-2 border-slate-200 rounded-md p-3 relative flex flex-col justify-between shadow-xs">
                  <span className="text-[10px] font-black text-slate-400 block">العربة 2 [TC M1]</span>
                  <div className="bg-amber-50 text-amber-900 border border-amber-200 text-[9px] font-black p-1 rounded text-center">
                    كابينة التيار المستمر: قاطع PANUVCB (بانتوغراف) قاطع التكييف وصندوق الحريق
                  </div>
                </div>

                {/* Connector */}
                <div className="w-4 h-6 bg-slate-300 rounded" />

                {/* CAR 3 */}
                <div className="w-36 h-28 bg-white border-2 border-slate-200 rounded-md p-3 relative flex flex-col justify-between shadow-xs">
                  <span className="text-[10px] font-black text-slate-400 block">العربة 3 [M2]</span>
                  <div className="bg-blue-50 text-blue-900 border border-blue-200 text-[9px] font-black p-1 rounded text-center">
                    شحن البطارية وموحد الجر. بلف عزل فرامل الهواء B09 أسفل المقاعد
                  </div>
                </div>

                {/* Connector */}
                <div className="w-4 h-6 bg-slate-300 rounded" />

                {/* CAR 4 */}
                <div className="w-36 h-28 bg-white border-2 border-slate-200 rounded-md p-3 relative flex flex-col justify-between shadow-xs">
                  <span className="text-[10px] font-black text-slate-400 block">العربة 4 [M3]</span>
                  <div className="bg-slate-100 text-slate-800 border border-slate-200 text-[9px] font-black p-1 rounded text-center">
                    إنفرتر مساعد ومحولات طاقة، بلف عزل الفرامل وصمامات الأبواب
                  </div>
                </div>

                {/* Connector */}
                <div className="w-4 h-6 bg-slate-300 rounded" />

                {/* CAR 5 */}
                <div className="w-36 h-28 bg-white border-2 border-slate-200 rounded-md p-3 relative flex flex-col justify-between shadow-xs">
                  <span className="text-[10px] font-black text-slate-400 block">العربة 5 [TC M4]</span>
                  <div className="bg-amber-50 text-amber-900 border border-amber-200 text-[9px] font-black p-1 rounded text-center">
                    كابينة تيار مستمر: قاطع بانتوغراف PANUVCB، صمامات فرامل الهواء B09
                  </div>
                </div>

                {/* Connector */}
                <div className="w-4 h-6 bg-slate-300 rounded" />

                {/* CAB 2 */}
                <div className="w-40 h-28 bg-white border-2 border-amber-500 rounded-l-3xl rounded-r-md p-3 relative flex flex-col justify-between shadow-xs">
                  <div className="absolute top-0 left-0 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-tl-2xl rounded-br-md">
                    موقع كابينة القيادة 2
                  </div>
                  <div className="pt-5 text-right">
                    <p className="text-xs font-black text-slate-800">كابينة القيادة 2</p>
                    <p className="text-[9px] text-slate-500 leading-relaxed">أزرار تحكم مكررة، قواطع راديو الكابينة 2، أقفال ومفاتيح الكابينة الخلفية.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SPEED LIMITS DATA TABLE */}
        {activeTab === 'speed_limits' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-6 text-right">
            <div className="space-y-1">
              <h2 className="text-md font-black text-slate-900 flex items-center justify-end gap-2">
                جدول حدود السرعات المعتمدة للأعطال الطارئة
                <Gauge className="w-5 h-5 text-amber-500" />
              </h2>
              <p className="text-xs text-slate-500">
                السرعات القصوى المسموح بها لقائد القطار أثناء مواجهة الأعطال المختلفة بناءً على المرفق صفحة 100 بالدليل.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-150">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-slate-700">
                    <th className="p-4 font-black">السرعة القصوى والتعليمات المتبعة</th>
                    <th className="p-4 font-black">نوع العطل ووصفه الفني</th>
                    <th className="p-4 font-black">رقم البند</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SPEED_LIMITS_DATA.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-black text-amber-600">{item.limitAr}</td>
                      <td className="p-4 font-bold">
                        <span className="text-slate-800 block">{item.malfunctionAr}</span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{item.malfunctionEn}</span>
                      </td>
                      <td className="p-4 font-black text-slate-400">#{item.id}</td>
                    </tr>
                  ))}
                  
                  {/* Additional hardcoded reference speeds from manual */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-black text-red-600">60 كم/ساعة بحد أقصى للجر المباشر مع عزل VCU.</td>
                    <td className="p-4 font-bold">
                      <span className="text-slate-800 block">تفعيل نظام تغذية الطوارئ المباشر (ETM)</span>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Emergency Traction Mode Activated</span>
                    </td>
                    <td className="p-4 font-black text-slate-400">#6</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-black text-amber-600">105 كم/ساعة بحد أقصى للعربة الواحدة، و90 كم/ساعة لعربتين.</td>
                    <td className="p-4 font-bold">
                      <span className="text-slate-800 block">عزل فرامل الهواء للعربة بالكامل (صمام B09)</span>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Air Brake Cylinder Isolation</span>
                    </td>
                    <td className="p-4 font-black text-slate-400">#7</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Toast alert system */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className={`fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md p-4 rounded-2xl shadow-xl z-50 border text-right flex items-start gap-3 ${
              toast.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : toast.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-sky-50 border-sky-200 text-sky-900'
            }`}
          >
            {toast.type === 'success' ? (
              <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 animate-bounce" />
            ) : toast.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
            ) : (
              <Clock className="w-5 h-5 text-sky-600 shrink-0 mt-0.5 animate-spin" />
            )}
            
            <div className="text-right flex-1">
              <span className="text-xs font-black">
                {toast.text}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
