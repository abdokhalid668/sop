import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Home, RotateCcw, Check, ChevronRight, HelpCircle, 
  CornerDownRight, AlertTriangle, PenTool, CheckCircle, ArrowRight, Info, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SOP, FlowchartNode, DriverShiftLog } from '../types';

interface SopWizardProps {
  key?: React.Key;
  sop: SOP;
  onGoHome: () => void;
  onBackToIndex: () => void;
  onLogCompleted: (log: Omit<DriverShiftLog, 'id' | 'timestamp'> & { notes?: string }) => void;
  onNavigateSop?: (sopCode: string) => void;
  onSessionUpdate?: (session: { sopCode: string; currentNodeId: string; history: string[] } | null) => void;
  initialNodeId?: string;
  initialHistory?: string[];
}

export default function SopWizard({ 
  sop, 
  onGoHome, 
  onBackToIndex, 
  onLogCompleted, 
  onNavigateSop,
  onSessionUpdate,
  initialNodeId = 'start',
  initialHistory = []
}: SopWizardProps) {
  // Dynamically calculate initial state for sub-step routing
  const getInitialDecisionsAndHistory = (startNode: string, targetNode: string): { decisions: Record<string, 'yes' | 'no'>; history: string[] } => {
    const decs: Record<string, 'yes' | 'no'> = {};
    const hist: string[] = [];
    
    interface PathState {
      nodeId: string;
      path: string[];
      decisions: Record<string, 'yes' | 'no'>;
    }
    
    const queue: PathState[] = [{ nodeId: startNode, path: [], decisions: {} }];
    const visited = new Set<string>();
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.nodeId === targetNode) {
        return { decisions: current.decisions, history: current.path };
      }
      
      if (visited.has(current.nodeId)) continue;
      visited.add(current.nodeId);
      
      const node = sop.flowchart[current.nodeId];
      if (!node) continue;
      
      if (node.type === 'question') {
        if (node.yes) {
          queue.push({
            nodeId: node.yes,
            path: [...current.path, current.nodeId],
            decisions: { ...current.decisions, [current.nodeId]: 'yes' }
          });
        }
        if (node.no) {
          queue.push({
            nodeId: node.no,
            path: [...current.path, current.nodeId],
            decisions: { ...current.decisions, [current.nodeId]: 'no' }
          });
        }
      } else {
        if (node.next) {
          queue.push({
            nodeId: node.next,
            path: [...current.path, current.nodeId],
            decisions: { ...current.decisions }
          });
        }
      }
    }
    
    return { decisions: {}, history: [] };
  };

  // Compute this once during render initialization if needed
  const preCalculated = useMemo(() => {
    if (initialNodeId && initialNodeId !== 'start') {
      return getInitialDecisionsAndHistory('start', initialNodeId);
    }
    return { decisions: {}, history: initialHistory };
  }, [sop, initialNodeId, initialHistory]);

  // Wizard state
  const [currentNodeId, setCurrentNodeId] = useState<string>(initialNodeId);
  const [history, setHistory] = useState<string[]>(() => {
    return preCalculated.history.length > 0 ? preCalculated.history : initialHistory;
  });
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  
  // Track interactive decisions & checklist completions for the full/quick view
  const [decisions, setDecisions] = useState<Record<string, 'yes' | 'no'>>(() => {
    return preCalculated.decisions;
  });

  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    const comps: Record<string, boolean> = {};
    const path = preCalculated.history.length > 0 ? preCalculated.history : initialHistory;
    path.forEach(hId => {
      const node = sop.flowchart[hId];
      if (node && node.type !== 'question') {
        comps[hId] = true;
      }
    });
    return comps;
  });

  // Track onSessionUpdate ref to prevent infinite loops in useEffect
  const onSessionUpdateRef = useRef(onSessionUpdate);
  useEffect(() => {
    onSessionUpdateRef.current = onSessionUpdate;
  }, [onSessionUpdate]);

  useEffect(() => {
    const session = {
      sopCode: sop.sop_code,
      currentNodeId: currentNodeId,
      history: history
    };
    localStorage.setItem('lrt_active_sop_session', JSON.stringify(session));
    onSessionUpdateRef.current?.(session);
  }, [sop.sop_code, currentNodeId, history]);

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

  const splitSopCode = (code: string) => {
    const cleanCode = code.replace(/SOP\s+/i, '').trim().toUpperCase();
    const parts = cleanCode.split('-');
    if (parts.length >= 3) {
      const part1 = parts.slice(0, 2).join('-');
      const part2 = parts.slice(2).join('-');
      return { part1, part2 };
    }
    return { part1: cleanCode, part2: '' };
  };

  const renderTextWithSopLinks = (text: string) => {
    if (!text) return null;
    
    const regex = /\s*\(?(?:SOP\s+)?(DRI-[A-Z]+-\d+(?:-\d+)?)\)?\s*/gi;
    const segments = text.split(regex);
    
    if (segments.length === 1) {
      return <span>{text}</span>;
    }
    
    return (
      <span className="leading-relaxed">
        {segments.map((seg, idx) => {
          if (idx % 2 === 1) {
            // This is an SOP code link!
            const code = seg.toUpperCase();
            const { part1, part2 } = splitSopCode(code);
            return (
              <span key={idx} className="inline-block align-middle mx-1.5 my-0.5 text-center select-none" dir="ltr">
                <svg 
                  width="100" 
                  height="65" 
                  viewBox="0 0 110 70" 
                  className="inline-block align-middle filter drop-shadow-sm cursor-pointer hover:scale-105 active:scale-95 hover:brightness-95 transition-all" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onNavigateSop?.(code); 
                  }}
                >
                  {/* Grey arrow pointing down */}
                  <g transform="translate(55, 10)">
                    <line x1="0" y1="-8" x2="0" y2="4" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                    <polygon points="-4,2 4,2 0,8" fill="#94a3b8" />
                  </g>
                  
                  {/* Pentagonal box (starts at y=20, width=100, height=45) */}
                  <polygon points="5,20 105,20 105,50 55,65 5,50" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="miter" />
                  
                  {/* Text inside the polygon */}
                  <text x="55" y="35" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#475569" fontFamily="monospace" letterSpacing="0.5">
                    {part1}-
                  </text>
                  <text x="55" y="48" textAnchor="middle" fontSize="12" fontWeight="900" fill="#0f172a" fontFamily="monospace" letterSpacing="0.5">
                    {part2}
                  </text>
                </svg>
              </span>
            );
          } else {
            return <span key={idx}>{seg}</span>;
          }
        })}
      </span>
    );
  };

  // Traces a linear path from a node ID, stopping if it hits the END or any stopAt nodes
  const tracePath = (startId: string | undefined, stopAt: Set<string> = new Set()) => {
    const path: Array<{ id: string; node: FlowchartNode }> = [];
    const localVisited = new Set<string>();
    let currentId = startId;
    
    while (currentId && currentId !== 'END' && !localVisited.has(currentId) && !stopAt.has(currentId)) {
      localVisited.add(currentId);
      const node = sop.flowchart[currentId];
      if (!node) break;
      path.push({ id: currentId, node });
      
      if (node.type === 'question') {
        break;
      }
      currentId = node.next;
    }
    return path;
  };

  // Traverses the flowchart sequentially from 'start' to build a main sequence
  const getSequentialSteps = (flowchart: Record<string, FlowchartNode>) => {
    const list: Array<{ id: string; node: FlowchartNode }> = [];
    const visited = new Set<string>();
    
    let currentId: string | undefined = 'start';
    
    while (currentId && currentId !== 'END' && !visited.has(currentId)) {
      visited.add(currentId);
      const node = flowchart[currentId];
      if (!node) break;
      
      list.push({ id: currentId, node });
      
      if (node.type === 'question') {
        break;
      }
      
      currentId = node.next;
    }
    
    // Also collect any remaining nodes to make sure nothing is missed
    const remaining: Array<{ id: string; node: FlowchartNode }> = [];
    Object.entries(flowchart).forEach(([id, node]) => {
      if (!visited.has(id) && id !== 'END') {
        remaining.push({ id, node });
      }
    });
    
    return { mainChain: list, remaining };
  };

  // Traverses flowchart dynamically based on decisions state to construct active sequence of steps
  const getDynamicChecklist = () => {
    const list: Array<{ id: string; node: FlowchartNode; index: number }> = [];
    const visited = new Set<string>();
    let currentId: string | undefined = 'start';
    let stepIndex = 1;

    while (currentId && currentId !== 'END' && !visited.has(currentId)) {
      visited.add(currentId);
      const node = sop.flowchart[currentId];
      if (!node) break;

      list.push({ id: currentId, node, index: stepIndex });
      stepIndex++;

      if (node.type === 'question') {
        const choice = decisions[currentId];
        if (choice === 'yes') {
          currentId = node.yes;
        } else if (choice === 'no') {
          currentId = node.no;
        } else {
          break; // Stop until user answers this question
        }
      } else {
        currentId = node.next;
      }
    }
    return list;
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
    setDecisions({});
    setCompletedSteps({});
  };

  // Toggles completed state of a checklist step in quick view
  const toggleStepCompletion = (stepId: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  // Saves decision path option ('yes' | 'no') and clears any downstream decisions/completions to avoid stale paths
  const handleDecision = (stepId: string, choice: 'yes' | 'no') => {
    setDecisions(prev => ({
      ...prev,
      [stepId]: choice
    }));
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

    // Reset wizard and go back to home screen
    onGoHome();
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
        {/* NEW FULL QUICK VIEW: Interactive checklist matching user video */}
        <div className="flex-1 overflow-y-auto bg-slate-50 px-4 md:px-6 py-4 md:py-6" dir="rtl">
          {/* Header card with SOP title and references */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 text-white p-5 sm:p-6 rounded-2xl border border-slate-750 shadow-md text-right relative overflow-hidden mb-6">
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex justify-between items-start">
              <span className="font-mono text-xs font-black bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-md tracking-wider">
                {sop.sop_code}
              </span>
              <span className="text-[10px] font-arabic tracking-widest text-slate-400 font-extrabold uppercase">
                بروتوكول تشغيل معتمد
              </span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-arabic font-black text-white mt-3.5 leading-relaxed">
              {sop.title_ar}
            </h2>
            
            {sop.reference_documents.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-700/60 flex flex-wrap gap-2 text-right justify-start text-[10px] sm:text-xs text-slate-400 items-center">
                <span className="font-arabic font-bold text-emerald-400 shrink-0">المراجع الرسمية المعتمدة:</span>
                {sop.reference_documents.map((ref, i) => (
                  <span key={i} className="bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded text-slate-300 font-medium">
                    {ref}
                  </span>
                ))}
              </div>
            )}
          </div>



          {/* Sequential Checklist matching video layout */}
          <div className="space-y-4 mb-6">
            <h4 className="font-arabic font-black text-slate-900 text-sm flex items-center justify-start gap-2 px-1">
              <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>قائمة الإجراءات المتسلسلة</span>
            </h4>

            <div className="space-y-4">
              {getDynamicChecklist().map((item) => {
                const isCompleted = !!completedSteps[item.id];
                const activeMeta = item.node.linked_metadata || [];
                const isQ = item.node.type === 'question';

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.002 }}
                    onClick={() => {
                      if (!isQ) {
                        toggleStepCompletion(item.id);
                      }
                    }}
                    className={`group relative bg-white rounded-2xl border p-4 sm:p-5 transition-all shadow-sm flex items-center justify-between gap-4 cursor-pointer select-none ${
                      isCompleted 
                        ? 'border-emerald-250 bg-emerald-50/10' 
                        : isQ
                        ? 'border-amber-250 bg-amber-50/5'
                        : 'border-slate-200 hover:border-slate-350'
                    }`}
                    dir="rtl"
                  >
                    <div className="flex-1 flex gap-4 items-start">
                      {/* Checkbox circle on the right side */}
                      {!isQ && (
                        <div 
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all mt-1 ${
                            isCompleted 
                              ? 'border-emerald-500 bg-emerald-500 text-white' 
                              : 'border-slate-300 group-hover:border-emerald-500'
                          }`}
                        >
                          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      )}

                      {/* Step Content */}
                      <div className="flex-1 space-y-1.5 text-right">
                        <div className="flex items-center space-x-2 space-x-reverse flex-wrap gap-y-1">
                          <span className="font-arabic text-[10px] font-bold text-slate-400">
                            خطوة المسير {String(item.index).padStart(2, '0')}
                          </span>
                          {isQ && (
                            <span className="text-[10px] font-arabic font-extrabold px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700">
                              نقطة اتخاذ قرار
                            </span>
                          )}
                        </div>

                        <p className={`font-arabic font-extrabold text-slate-800 text-sm sm:text-base leading-relaxed transition-all ${
                          isCompleted ? 'line-through text-slate-400 opacity-60' : ''
                        }`}>
                          {renderTextWithSopLinks(item.node.text_ar)}
                        </p>

                        {/* If it's a question, render Yes/No buttons */}
                        {isQ && (
                          <div className="flex items-center gap-3 mt-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDecision(item.id, 'yes');
                              }}
                              className={`px-4 py-2 rounded-xl text-xs font-arabic font-black transition-all ${
                                decisions[item.id] === 'yes'
                                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              نعم
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDecision(item.id, 'no');
                              }}
                              className={`px-4 py-2 rounded-xl text-xs font-arabic font-black transition-all ${
                                decisions[item.id] === 'no'
                                  ? 'bg-red-600 text-white shadow-md shadow-red-600/10'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              لا
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata Badges (like SP) on the Left */}
                    {activeMeta.length > 0 && (
                      <div className="flex items-center gap-1.5 shrink-0" dir="ltr">
                        {activeMeta.map((key) => {
                          const data = sop.metadata[key];
                          if (!data) return null;
                          const isSafety = data.type === 'safety_point' || key.startsWith('S');
                          return (
                            <button
                              key={key}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMetadataKey(key);
                              }}
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-black text-xs shadow-md cursor-pointer border-2 border-white hover:scale-110 active:scale-95 transition-all shrink-0 ${
                                isSafety 
                                  ? 'bg-red-500 text-white animate-pulse hover:bg-red-600 ring-2 ring-red-100' 
                                  : 'bg-[#059669] text-white hover:bg-emerald-750 ring-2 ring-emerald-100'
                              }`}
                              title={isSafety ? `إجراء سلامة ${key} - اضغط للتفاصيل` : `ملاحظة تشغيلية ${key} - اضغط للتفاصيل`}
                            >
                              {isSafety ? 'SP' : key}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Complete Action Button */}
          <div className="pt-6 border-t border-slate-200 text-right">
            <button
              onClick={handleFinalizeLog}
              className="w-full py-4 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-emerald-600/15 transition-all active:scale-95 flex items-center justify-center space-x-3 space-x-reverse cursor-pointer"
            >
              <CheckCircle className="w-5.5 h-5.5 sm:w-6 sm:h-6 shrink-0 fill-current text-white" />
              <span>تأكيد إكمال الإجراء بالكامل وإنهاء التشغيل</span>
            </button>
          </div>

        </div>
      </div>

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
