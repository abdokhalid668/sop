import React from 'react';
import { X, FileText, Download, Trash2, Calendar, ClipboardCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DriverShiftLog } from '../types';

interface ShiftLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: DriverShiftLog[];
  onClearLogs: () => void;
}

export default function ShiftLogsModal({ isOpen, onClose, logs, onClearLogs }: ShiftLogsModalProps) {
  
  // Export logs to JSON download
  const handleExportJSON = () => {
    if (logs.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60000;
    const localDate = new Date(now.getTime() - offsetMs);
    const localDateStr = localDate.toISOString().slice(0, 10);
    downloadAnchor.setAttribute("download", `LRT_SHIFT_SOP_LOGS_${localDateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-end"
        >
          {/* Main Slide-out Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-xl h-full bg-white border-l border-slate-200 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-5 h-5 text-emerald-600" />
                <div className="text-left">
                  <h3 className="font-black text-slate-900 text-base">Active Driver Shift Logs</h3>
                  <p className="text-[10px] font-mono text-slate-500 tracking-wider">LOCAL REPOSITORY (OFFLINE)</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors focus:outline-none"
                id="btn-close-shift-logs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Logs Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 relative overflow-hidden shadow-sm"
                    id={`shift-log-card-${log.id}`}
                  >
                    <div className={`absolute top-0 left-0 bottom-0 w-[4px] ${
                      log.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                    
                    {/* Timestamp & Code */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <div className="space-y-1 text-left">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-emerald-700 font-extrabold bg-emerald-50 border border-emerald-200 px-1 py-0.5 rounded text-[8px] uppercase">
                            Open / الفتح
                          </span>
                          <span className="text-slate-700 font-bold">{log.openTimestamp || log.timestamp}</span>
                        </div>
                        {log.status === 'completed' && (
                          <div className="flex items-center space-x-1.5">
                            <span className="text-slate-600 font-extrabold bg-slate-100 border border-slate-200 px-1 py-0.5 rounded text-[8px] uppercase">
                              Done / الانتهاء
                            </span>
                            <span className="text-slate-600">{log.timestamp}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {log.sopCode}
                        </span>
                        <span className={`text-[8px] font-extrabold uppercase px-1 py-0.5 rounded ${
                          log.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {log.status === 'completed' ? '✓ Completed' : '● Active'}
                        </span>
                      </div>
                    </div>

                    {/* SOP Title */}
                    <h4 className="font-black text-slate-800 text-sm text-left">
                      {log.sopTitle}
                    </h4>

                    {/* Step Pathway details */}
                    <div className="bg-white rounded-lg p-2.5 border border-slate-100 text-left">
                      <p className="text-[10px] font-mono text-slate-450 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Execution Pathway
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {log.outcome}
                      </p>
                    </div>

                    {/* Driver Comments */}
                    {log.notes && (
                      <div className="border-l-2 border-amber-500 pl-3 text-left">
                        <p className="text-[9px] font-mono font-bold text-amber-700 uppercase">Driver Remarks</p>
                        <p className="text-xs text-slate-500 leading-relaxed italic mt-0.5">
                          "{log.notes}"
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-slate-400 py-16">
                  <AlertCircle className="w-12 h-12 text-slate-200 mb-3" />
                  <p className="text-sm font-bold text-slate-550">No shift logs found</p>
                  <p className="text-xs text-slate-400 max-w-xs mt-1 text-center leading-relaxed">
                    Execute Standard Operating Procedure wizards to completion and sign-off on incident reports to populate this log sheet.
                  </p>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            {logs.length > 0 && (
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 shrink-0 flex items-center justify-between gap-4">
                <button
                  onClick={onClearLogs}
                  className="flex items-center space-x-1.5 text-red-650 hover:text-red-750 hover:bg-red-50 px-3.5 py-2 rounded-lg transition-colors text-xs font-bold"
                  id="btn-clear-logs"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All Logs</span>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg transition-all text-xs font-black shadow-md"
                  id="btn-export-logs"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD REPORT (JSON)</span>
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
