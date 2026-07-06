import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Home, RotateCcw, Check, ChevronRight, HelpCircle, 
  CornerDownRight, AlertTriangle, PenTool, CheckCircle, ArrowRight, Play, Info, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SOP, FlowchartNode, DriverShiftLog } from '../types';

interface SopWizardProps {
  sop: SOP;
  onGoHome: () => void;
  onBackToIndex: () => void;
  onLogCompleted: (log: Omit<DriverShiftLog, 'id' | 'timestamp'> & { notes?: string }) => void;
}

export default function SopWizard({ sop, onGoHome, onBackToIndex, onLogCompleted }: SopWizardProps) {
  // Wizard state
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [history, setHistory] = useState<string[]>([]);
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');

  // Selected S1 / P1 key to show in full detail modal popup
  const [selectedMetadataKey, setSelectedMetadataKey] = useState<string | null>(null);

  // S1 / P1 details toggle expanded state
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  const toggleKey = (key: string) => {
    setExpandedKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  React.useEffect(() => {
    // Reset expanded states and selected popup when step changes
    setExpandedKeys({});
    setSelectedMetadataKey(null);
  }, [currentNodeId]);

  // Get current node details
  const currentNode: FlowchartNode = useMemo(() => {
    return sop.flowchart[currentNodeId] || { text_ar: "خطأ في تحميل الخطوة", text_en: "Error loading step" };
  }, [sop, currentNodeId]);

  // Is current node a question, action, or end?
  const isQuestion = currentNode.type === 'question';
  const isEnd = currentNode.type === 'end' || currentNodeId === 'END';

  // Handle decisions & progression
  const handleNext = (choice?: 'yes' | 'no') => {
    let nextNodeId = '';

    if (isQuestion && choice) {
      nextNodeId = choice === 'yes' ? (currentNode.yes || 'END') : (currentNode.no || 'END');
    } else {
      nextNodeId = currentNode.next || 'END';
    }

    // Save history for backtrack/undo
    setHistory(prev => [...prev, currentNodeId]);
    setCurrentNodeId(nextNodeId);
  };

  // Backtrack to previous step
  const handleBackStep = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const previousNodeId = newHistory.pop()!;
    setHistory(newHistory);
    setCurrentNodeId(previousNodeId);
  };

  // Jump to specific step from history
  const handleJumpToHistory = (nodeId: string, idx: number) => {
    setCurrentNodeId(nodeId);
    setHistory(prev => prev.slice(0, idx));
  };

  // Reset entire wizard
  const handleReset = () => {
    setCurrentNodeId('start');
    setHistory([]);
    setSessionNotes('');
    setIsLogDrawerOpen(false);
  };

  // Finalize procedure and save log
  const handleFinalizeLog = () => {
    // Generate a summary of the path taken
    const pathSummary = history.map((hId, index) => {
      const node = sop.flowchart[hId];
      const nextId = index < history.length - 1 ? history[index + 1] : currentNodeId;
      const isQ = node.type === 'question';
      let outcome = '';
      if (isQ) {
        outcome = node.yes === nextId ? ' [YES]' : ' [NO]';
      }
      return `${sop.flowchart[hId].text_en || hId}${outcome}`;
    }).join(' ➔ ');

    onLogCompleted({
      sopCode: sop.sop_code,
      sopTitle: sop.title_en,
      outcome: `Terminal node reached: "${currentNode.text_en || 'END'}". Path: ${pathSummary || 'Direct Start-End'}`,
      notes: sessionNotes.trim() || undefined
    });

    // Reset wizard and go back to categories
    onBackToIndex();
  };

  // Gather active metadata tags for current step
  const activeMetadataKeys = currentNode.linked_metadata || [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* SOP Wizard Navigation & Title Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between shrink-0 gap-3 z-10 shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToIndex}
            className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-all text-xs font-semibold"
            id="btn-wizard-back-index"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>INDEX</span>
          </button>
          
          <button
            onClick={onGoHome}
            className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-all text-xs font-semibold"
            id="btn-wizard-home"
          >
            <Home className="w-3.5 h-3.5" />
            <span>HOME</span>
          </button>

          <span className="text-slate-300">|</span>

          {/* Current SOP Info */}
          <div className="text-left">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-black bg-slate-50 border border-slate-200 text-emerald-700 px-2 py-0.5 rounded">
                {sop.sop_code}
              </span>
              <h3 className="text-xs sm:text-sm font-arabic font-black text-slate-850">
                {sop.title_ar}
              </h3>
            </div>
          </div>
        </div>

        {/* Quick Utility Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 transition-all text-xs font-bold"
            id="btn-wizard-restart"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESTART</span>
          </button>
        </div>
      </div>

      {/* Main Workspace (Full Width) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Interactive Step Box - Expanded Full Width */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50/50 p-6 justify-between">
          
          {/* Breadcrumb tracker showing path history */}
          <div className="shrink-0 bg-white border border-slate-200 rounded-xl px-4 py-2.5 mb-6 text-left shadow-sm">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase block mb-1">
              Active Steps Path Log ({history.length + 1})
            </span>
            <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-thin text-xs text-slate-500 select-none">
              <button 
                onClick={() => handleJumpToHistory('start', 0)}
                disabled={history.length === 0}
                className={`font-mono px-2 py-0.5 rounded transition-all shrink-0 ${
                  currentNodeId === 'start' 
                    ? 'bg-emerald-50 border border-emerald-300 text-emerald-700 font-bold' 
                    : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700'
                }`}
              >
                1: START
              </button>

              {history.map((nodeId, idx) => {
                if (nodeId === 'start') return null; // already rendered
                return (
                  <React.Fragment key={nodeId}>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <button
                      onClick={() => handleJumpToHistory(nodeId, idx)}
                      className={`font-mono px-2 py-0.5 rounded transition-all shrink-0 ${
                        currentNodeId === nodeId 
                          ? 'bg-emerald-50 border border-emerald-300 text-emerald-700 font-bold' 
                          : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700'
                      }`}
                    >
                      {idx + 1}: {nodeId.substring(0, 10).toUpperCase()}
                    </button>
                  </React.Fragment>
                );
              })}

              {currentNodeId !== 'start' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono px-2 py-0.5 rounded bg-emerald-50 border border-emerald-300 text-emerald-700 font-bold shrink-0">
                    {history.length + 1}: {currentNodeId.toUpperCase()}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Core Panel: Active Question or Action */}
          <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full my-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentNodeId}
                initial={{ opacity: 0, scale: 0.97, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl relative text-left"
                id="active-step-card"
              >
                {/* Node type decorative label */}
                <div className="absolute top-4 right-6 flex items-center space-x-2">
                  <span className={`text-[9px] font-mono tracking-widest font-black uppercase px-2 py-0.5 rounded border ${
                    isEnd 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : isQuestion 
                      ? 'bg-amber-50 border-amber-200 text-amber-700' 
                      : 'bg-blue-50 border-blue-200 text-blue-700'
                  }`}>
                    {isEnd ? 'TERMINAL STATE' : isQuestion ? 'DECISION POINT' : 'REMEDIAL ACTION'}
                  </span>
                </div>

                {/* Left vertical visual alignment bar */}
                <div className={`absolute top-0 bottom-0 left-0 w-[6px] rounded-l-3xl ${
                  isEnd 
                    ? 'bg-emerald-500' 
                    : isQuestion 
                    ? 'bg-amber-500' 
                    : 'bg-blue-500'
                }`} />

                {/* Step ID Index */}
                <p className="text-xs font-mono font-bold text-slate-400 mb-1">
                  PROCEDURE STEP ID: {currentNodeId.toUpperCase()}
                </p>

                {/* Core Arabic Presentation */}
                <div className="space-y-6 pt-4">
                  {/* Arabic Text in Egypt/LRT Cairo font with clickable badges on the left */}
                  <div className="border-r-4 border-amber-500/30 pr-4 py-2 text-right flex flex-wrap items-center justify-start gap-3 sm:gap-4" dir="rtl">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-arabic font-extrabold text-slate-800 leading-relaxed tracking-wide inline">
                      {currentNode.text_ar}
                    </h2>
                    {activeMetadataKeys.length > 0 && (
                      <div className="flex items-center gap-2 shrink-0" dir="ltr">
                        {activeMetadataKeys.map((key) => {
                          const data = sop.metadata[key];
                          if (!data) return null;
                          const isSafety = data.type === 'safety_point' || key.startsWith('S');
                          return (
                            <button
                              key={key}
                              onClick={() => setSelectedMetadataKey(key)}
                              className={`w-11 h-11 rounded-full flex items-center justify-center font-mono font-black text-sm shadow-md cursor-pointer border-2 border-white hover:scale-115 active:scale-95 transition-all shrink-0 ${
                                isSafety 
                                  ? 'bg-red-500 text-white animate-pulse hover:bg-red-600 ring-2 ring-red-100' 
                                  : 'bg-[#059669] text-white hover:bg-emerald-700 ring-2 ring-emerald-100'
                              }`}
                              title={isSafety ? `إجراء سلامة ${key} - اضغط للتفاصيل` : `ملاحظة تشغيلية ${key} - اضغط للتفاصيل`}
                            >
                              {key}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive touch action targets (Large bottom buttons) */}
          <div className="shrink-0 pt-6 border-t border-slate-200 flex flex-col space-y-4">
            
            {/* Binary touch buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Backstep button on left */}
              {history.length > 0 && (
                <button
                  onClick={handleBackStep}
                  className="sm:hidden w-full py-3 bg-white hover:bg-slate-50 text-slate-750 font-bold rounded-xl border border-slate-200 text-xs flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>UNDO PREVIOUS STEP</span>
                </button>
              )}

              {/* Main controls depending on node type */}
              {isQuestion ? (
                <>
                  {/* NO Target (Red/Dark) */}
                  <button
                    onClick={() => handleNext('no')}
                    className="w-full py-5 bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-red-500/10 transition-all active:scale-95 flex items-center justify-center space-x-3 focus:outline-none focus:ring-4 focus:ring-red-500/30"
                    id="btn-wizard-no"
                  >
                    <span className="font-mono text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-red-800 border border-red-600 text-red-100">NO</span>
                    <span>لا</span>
                  </button>

                  {/* YES Target (Cyan/Green) */}
                  <button
                    onClick={() => handleNext('yes')}
                    className="w-full py-5 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-500/10 transition-all active:scale-95 flex items-center justify-center space-x-3 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
                    id="btn-wizard-yes"
                  >
                    <span className="font-mono text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-800 border border-emerald-650 text-emerald-100">YES</span>
                    <span>نعم</span>
                  </button>
                </>
              ) : isEnd ? (
                /* END state - trigger Shift Log Drawer */
                <button
                  onClick={() => setIsLogDrawerOpen(true)}
                  className="w-full sm:col-span-2 py-5 bg-gradient-to-br from-emerald-600 to-emerald-750 hover:from-emerald-500 hover:to-emerald-650 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-600/10 transition-all active:scale-95 flex items-center justify-center space-x-3 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
                  id="btn-wizard-complete-log"
                >
                  <CheckCircle className="w-6 h-6 shrink-0 fill-current" />
                  <span>COMPLETE & LOG PROCEDURE</span>
                  <span className="font-arabic font-bold text-sm">(إنهاء وتسجيل الإجراء)</span>
                </button>
              ) : (
                /* Simple action continuation button */
                <button
                  onClick={() => handleNext()}
                  className="w-full sm:col-span-2 py-5 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-600/10 transition-all active:scale-95 flex items-center justify-center space-x-3 focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
                  id="btn-wizard-proceed"
                >
                  <span>PROCEED TO NEXT STEP</span>
                  <span className="font-arabic font-bold text-sm">(متابعة للخطوة التالية)</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </button>
              )}

            </div>

            {/* Desktop Back button in footer */}
            {history.length > 0 && (
              <div className="hidden sm:flex items-center justify-between text-xs text-slate-500">
                <span>Mistake? You can go back one step or click any step above in the path.</span>
                <button
                  onClick={handleBackStep}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-lg border border-slate-200 transition-all flex items-center space-x-1.5 focus:outline-none shadow-sm"
                  id="btn-wizard-undo"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>UNDO PREVIOUS STEP</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* COMPLETED REPORT LOG OVERLAY / DRAWER */}
      <AnimatePresence>
        {isLogDrawerOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between" dir="rtl">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <PenTool className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-arabic font-black text-slate-900 text-base">تقديم تقرير حادث تشغيلي</h3>
                </div>
                <button 
                  onClick={() => setIsLogDrawerOpen(false)}
                  className="text-slate-550 hover:text-slate-800 text-xs font-arabic font-extrabold focus:outline-none cursor-pointer"
                >
                  إلغاء
                </button>
              </div>

              {/* Drawer Body Form */}
              <div className="p-6 space-y-4 text-right" dir="rtl">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-500">
                    <span className="font-arabic font-bold">كود الإجراء المنفذ:</span>
                    <span className="font-semibold">{sop.sop_code}</span>
                  </div>
                  <h4 className="font-arabic font-black text-slate-900 text-sm">{sop.title_ar}</h4>
                  <p className="text-xs font-arabic text-slate-500">
                    اكتملت جميع الفحوصات والمسارات المطلوبة بنجاح. أنت الآن مخول بتسجيل هذا التقرير.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-arabic font-bold text-slate-500 text-right">
                    ملاحظات السائق / تفاصيل إضافية (اختياري)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="أدخل أي ملاحظات (مثال: تم إعادة التشغيل بنجاح، تم إبلاغ ناظر المحطة يدوياً)..."
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-right"
                    id="textarea-session-remarks"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start space-x-2.5 space-x-reverse text-right">
                  <AlertTriangle className="w-4.5 h-4.5 text-amber-650 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-arabic font-bold text-amber-800 leading-relaxed">
                    من خلال إرسال هذا التقرير، فإنك تؤكد الامتثال لبروتوكولات السلامة القياسية. يقوم هذا بتسجيل رقم القطار ورقم السائق ومسار التدفق بالتفصيل في ملف المزامنة المحلي.
                  </p>
                </div>
              </div>

              {/* Drawer Action Buttons */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  onClick={() => setIsLogDrawerOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-650 hover:text-slate-900 border border-slate-200 rounded-lg text-xs font-bold transition-colors focus:outline-none"
                >
                  Go Back
                </button>
                <button
                  onClick={handleFinalizeLog}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black flex items-center space-x-1 transition-all hover:shadow-md focus:outline-none"
                  id="btn-confirm-submit-log"
                >
                  <Check className="w-4 h-4 shrink-0" />
                  <span>LOG & SIGN OUT</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Beautiful Modal for Metadata Details */}
      <AnimatePresence>
        {selectedMetadataKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" id="metadata-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.35 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden"
              dir="rtl"
              id="metadata-modal"
            >
              {(() => {
                const data = sop.metadata[selectedMetadataKey];
                if (!data) return null;
                const isSafety = data.type === 'safety_point' || selectedMetadataKey.startsWith('S');
                return (
                  <div className="flex flex-col h-full">
                    {/* Modal Header */}
                    <div className={`p-5 text-white flex items-center justify-between ${
                      isSafety ? 'bg-gradient-to-r from-red-600 to-red-500' : 'bg-gradient-to-r from-emerald-600 to-emerald-500'
                    }`}>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-mono font-black text-lg shadow-inner">
                          {selectedMetadataKey}
                        </div>
                        <div>
                          <h3 className="font-arabic font-extrabold text-base">
                            {isSafety ? 'إجراء سلامة هام جداً' : 'ملاحظة تشغيلية هامة'}
                          </h3>
                          <p className="text-[9px] opacity-85 font-mono tracking-wider text-left animate-pulse" dir="ltr">
                            {isSafety ? 'CRITICAL SAFETY DIRECTIVE' : 'OPERATIONAL REQUIREMENT'}
                          </p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setSelectedMetadataKey(null)}
                        className="text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full transition-all cursor-pointer focus:outline-none"
                        title="إغلاق"
                        id="btn-close-modal-top"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-5 text-right">
                      <div className="flex justify-center">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md ${
                          isSafety ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {isSafety ? (
                            <AlertTriangle className="w-7 h-7 animate-bounce" />
                          ) : (
                            <Info className="w-7 h-7" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className={`inline-block text-[11px] font-arabic font-extrabold px-3 py-1 rounded-full ${
                          isSafety ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-[#059669]'
                        }`}>
                          التعليمات والضوابط المطلوبة:
                        </span>
                        <p className="font-arabic font-black text-base sm:text-lg text-slate-800 leading-relaxed whitespace-pre-line pt-1">
                          {data.text_ar}
                        </p>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="bg-slate-50 px-6 py-4 flex justify-start border-t border-slate-100">
                      <button
                        onClick={() => setSelectedMetadataKey(null)}
                        className={`font-arabic font-black px-5 py-2 rounded-xl shadow-md text-white transition-all cursor-pointer text-xs ${
                          isSafety 
                            ? 'bg-red-600 hover:bg-red-700 hover:shadow-red-200' 
                            : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-200'
                        }`}
                        id="btn-close-modal-bottom"
                      >
                        مفهوم، إغلاق
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
