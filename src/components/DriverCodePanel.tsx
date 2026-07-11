import React, { useState, useMemo, useEffect } from 'react';
import { UserCheck, Train, Calendar, Clock, Plus, Search, Trash2, CheckCircle2, Copy, FileSpreadsheet, LogOut, ExternalLink, RefreshCw, Cloud, FileText, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { DriverRegistrationLog } from '../types';

interface DriverCodePanelProps {
  currentDriverId: string;
  currentTrainId: string;
  currentLocation: string;
  onUpdateDriverId: (id: string) => void;
  onUpdateTrainId: (id: string) => void;
  onUpdateLocation: (location: string) => void;
  // Google Sheets integration props
  googleUser: any;
  spreadsheetUrl: string | null;
  spreadsheetName: string | null;
  isSyncingSheets: boolean;
  sheetsError: string | null;
  onGoogleLogin: () => Promise<void>;
  onGoogleLogout: () => Promise<void>;
  onCreateNewSheet: () => Promise<void>;
  onSyncAllHistory: () => Promise<void>;
  onRegisterToSheetsDirectly?: (reg: DriverRegistrationLog) => Promise<void>;
  // Notes props
  generalNotes: string;
  setGeneralNotes: (val: string) => void;
  currentNotes: string;
  setCurrentNotes: (val: string) => void;
  onSaveNotes: (generalNotes: string, currentNotes: string, addedNoteText?: string) => Promise<boolean>;
  onFetchNotes: () => Promise<void>;
  importantInstructions?: string[];
}

export default function DriverCodePanel({
  currentDriverId,
  currentTrainId,
  currentLocation,
  onUpdateDriverId,
  onUpdateTrainId,
  onUpdateLocation,
  googleUser,
  spreadsheetUrl,
  spreadsheetName,
  isSyncingSheets,
  sheetsError,
  onGoogleLogin,
  onGoogleLogout,
  onCreateNewSheet,
  onSyncAllHistory,
  onRegisterToSheetsDirectly,
  generalNotes,
  setGeneralNotes,
  currentNotes,
  setCurrentNotes,
  onSaveNotes,
  onFetchNotes,
  importantInstructions = []
}: DriverCodePanelProps) {
  // Local state for the form inputs
  const [driverInput, setDriverInput] = useState(currentDriverId);
  const [trainInput, setTrainInput] = useState(currentTrainId);
  const [locationInput, setLocationInput] = useState(currentLocation);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter type: 'current' (default) or a specific train ID (e.g. 'TR-012')
  const [filterType, setFilterType] = useState<string>('current');
  const [showDirectoryModal, setShowDirectoryModal] = useState(false);

  // Local state for General Notes and Current Notes
  const [localNotes, setLocalNotes] = useState<string>(generalNotes);
  const [localCurrentNotes, setLocalCurrentNotes] = useState<string>(currentNotes);
  const [isSavingNotesStatus, setIsSavingNotesStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // New structured notes directory states
  const [newNoteDraft, setNewNoteDraft] = useState('');
  const [notesSearch, setNotesSearch] = useState('');
  const [parsedNotes, setParsedNotes] = useState<any[]>([]);

  // Parse generalNotes (which will act as a serialized JSON notes array)
  useEffect(() => {
    if (generalNotes) {
      try {
        const parsed = JSON.parse(generalNotes);
        if (Array.isArray(parsed)) {
          setParsedNotes(parsed);
          return;
        }
      } catch (e) {
        // Fallback for legacy plain text notes or newline-separated notes written directly in Google Sheets
        if (generalNotes.trim()) {
          const lines = generalNotes.split('\n').map(line => line.trim()).filter(Boolean);
          const parsedLines = lines.map((line, idx) => ({
            id: `sheet-note-${idx}-${Date.now()}`,
            text: line,
            timestamp: 'ملاحظة عامة من الشيت',
            trainId: 'عام'
          }));
          setParsedNotes(parsedLines);
          return;
        }
      }
    }
    setParsedNotes([]);
  }, [generalNotes]);

  // Synchronize local notes state with incoming props
  useEffect(() => {
    setLocalNotes(generalNotes);
  }, [generalNotes]);

  useEffect(() => {
    setLocalCurrentNotes(currentNotes);
  }, [currentNotes]);

  const handleSaveNotesClick = async () => {
    setIsSavingNotesStatus('saving');
    const success = await onSaveNotes(localNotes, localCurrentNotes);
    setIsSavingNotesStatus(success ? 'saved' : 'error');
    if (success) {
      setTimeout(() => setIsSavingNotesStatus('idle'), 3000);
    }
  };

  const handleFetchNotesClick = async () => {
    setIsSavingNotesStatus('saving');
    await onFetchNotes();
    setIsSavingNotesStatus('saved');
    setTimeout(() => setIsSavingNotesStatus('idle'), 2000);
  };

  const handleAddNote = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newNoteDraft.trim()) return;

    const now = new Date();
    // Arabic friendly date and time formatting
    const formattedTime = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const formattedDate = now.toLocaleDateString('ar-EG');
    
    const newNoteItem = {
      id: `note-${Date.now()}`,
      text: newNoteDraft.trim(),
      timestamp: `${formattedTime} - ${formattedDate}`,
      trainId: currentTrainId || 'عام'
    };

    const updatedList = [newNoteItem, ...parsedNotes];
    setParsedNotes(updatedList);
    
    const jsonString = JSON.stringify(updatedList);
    setGeneralNotes(jsonString);
    const textToLog = newNoteItem.text;
    setNewNoteDraft(''); // Reset input bar draft

    setIsSavingNotesStatus('saving');
    const success = await onSaveNotes(jsonString, localCurrentNotes, textToLog);
    setIsSavingNotesStatus(success ? 'saved' : 'error');
    if (success) {
      setTimeout(() => setIsSavingNotesStatus('idle'), 3000);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (id.startsWith('sheet-instruction-')) {
      alert('لا يمكن حذف هذه الملاحظة لأنها تعليمات إدارية هامة مسجلة مباشرة في شيت Google Sheets. يجب تعديلها أو حذفها من الشيت نفسه.');
      return;
    }

    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه الملاحظة؟')) {
      const updatedList = parsedNotes.filter(n => n.id !== id);
      setParsedNotes(updatedList);
      
      const jsonString = JSON.stringify(updatedList);
      setGeneralNotes(jsonString);

      setIsSavingNotesStatus('saving');
      const success = await onSaveNotes(jsonString, localCurrentNotes);
      setIsSavingNotesStatus(success ? 'saved' : 'error');
      if (success) {
        setTimeout(() => setIsSavingNotesStatus('idle'), 3000);
      }
    }
  };

  // Combine user-created notes with management important instructions from the sheet
  const combinedNotes = useMemo(() => {
    const list: any[] = [];
    
    // Put important sheet instructions FIRST so they are highlighted at the top
    if (importantInstructions && importantInstructions.length > 0) {
      importantInstructions.forEach((text, idx) => {
        list.push({
          id: `sheet-instruction-${idx}`,
          text: text,
          timestamp: 'تعليمات ضرورية من الشيت',
          trainId: 'إدارة التشغيل',
          isImportant: true
        });
      });
    }
    
    // Then append the standard user notes
    list.push(...parsedNotes);
    return list;
  }, [parsedNotes, importantInstructions]);

  // Filter notes by search keyword or Train ID
  const filteredNotes = useMemo(() => {
    return combinedNotes.filter(note => {
      const q = notesSearch.toLowerCase().trim();
      if (!q) return true;
      return (
        note.text.toLowerCase().includes(q) ||
        (note.trainId && note.trainId.toLowerCase().includes(q)) ||
        note.timestamp.includes(q)
      );
    });
  }, [combinedNotes, notesSearch]);

  // Load registration history from local storage
  const [registrations, setRegistrations] = useState<DriverRegistrationLog[]>(() => {
    const saved = localStorage.getItem('lrt_driver_registrations');
    return saved ? JSON.parse(saved) : [
      {
        id: 'init-1',
        driverId: 'DRV-4089',
        trainId: 'TR-012',
        timestamp: '2026-06-29 08:30:15',
        location: 'محطة عدلى منصور'
      },
      {
        id: 'init-2',
        driverId: 'DRV-3052',
        trainId: 'TR-005',
        timestamp: '2026-06-28 14:15:00',
        location: 'بدر'
      }
    ];
  });

  // Calculate unique trains and their operation dates directory
  const trainDirectory = useMemo(() => {
    const groups: { [trainId: string]: { dates: string[]; drivers: string[] } } = {};
    
    registrations.forEach(reg => {
      const date = reg.timestamp.split(' ')[0]; // e.g. "2026-06-29"
      const train = reg.trainId.toUpperCase().trim();
      const driver = reg.driverId.toUpperCase().trim();
      
      if (!groups[train]) {
        groups[train] = { dates: [], drivers: [] };
      }
      if (!groups[train].dates.includes(date)) {
        groups[train].dates.push(date);
      }
      if (!groups[train].drivers.includes(driver)) {
        groups[train].drivers.push(driver);
      }
    });
    
    return Object.keys(groups).map(trainId => ({
      trainId,
      dates: groups[trainId].dates.sort((a, b) => b.localeCompare(a)),
      drivers: groups[trainId].drivers,
    })).sort((a, b) => a.trainId.localeCompare(b.trainId));
  }, [registrations]);

  // Handle new driver registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverInput.trim() || !trainInput.trim() || !locationInput) {
      alert('الرجاء إدخال كود القائد ورقم القطار والموقع بشكل صحيح');
      return;
    }

    const now = new Date();
    // Beautiful Arabic friendly local timestamp format
    const offsetMs = now.getTimezoneOffset() * 60000;
    const localDate = new Date(now.getTime() - offsetMs);
    const formattedDate = localDate.toISOString().replace('T', ' ').substring(0, 19);

    const newLog: DriverRegistrationLog = {
      id: `reg-${Date.now()}`,
      driverId: driverInput.trim().toUpperCase(),
      trainId: trainInput.trim().toUpperCase(),
      timestamp: formattedDate,
      location: locationInput
    };

    const updated = [newLog, ...registrations];
    setRegistrations(updated);
    localStorage.setItem('lrt_driver_registrations', JSON.stringify(updated));

    // Update global states in App.tsx
    onUpdateDriverId(newLog.driverId);
    onUpdateTrainId(newLog.trainId);
    onUpdateLocation(newLog.location);

    // Sync to Google Sheets if connected
    if (onRegisterToSheetsDirectly) {
      onRegisterToSheetsDirectly(newLog);
    }

    // Keep filter on current train to see the new entry immediately
    setFilterType('current');

    // Show beautiful success notification
    setSuccessMessage(`تم تسجيل القائد ${newLog.driverId} على القطار ${newLog.trainId} في ${newLog.location} بنجاح!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Delete a registration log
  const handleDeleteLog = (id: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا التسجيل؟')) {
      const updated = registrations.filter(r => r.id !== id);
      setRegistrations(updated);
      localStorage.setItem('lrt_driver_registrations', JSON.stringify(updated));
    }
  };

  // Copy entry details to clipboard
  const handleCopyEntry = (log: DriverRegistrationLog) => {
    const text = `كود القائد: ${log.driverId} | رقم القطار: ${log.trainId} ${log.location ? `| الموقع: ${log.location}` : ''} | التاريخ والوقت: ${log.timestamp}`;
    navigator.clipboard.writeText(text);
    alert('تم نسخ بيانات التسجيل بنجاح!');
  };

  // Filtered registrations based on both the selected train filter and the search query
  const filteredRegistrations = useMemo(() => {
    let list = registrations;

    // Apply active Train ID filter
    if (filterType === 'current') {
      list = list.filter(r => r.trainId.toUpperCase() === currentTrainId.toUpperCase());
    } else {
      // Filter by custom selected train ID
      list = list.filter(r => r.trainId.toUpperCase() === filterType.toUpperCase());
    }

    // Apply search query input
    const query = searchQuery.trim().toLowerCase();
    if (!query) return list;
    return list.filter(
      r => r.driverId.toLowerCase().includes(query) || 
           r.trainId.toLowerCase().includes(query) || 
           r.timestamp.includes(query) ||
           (r.location && r.location.toLowerCase().includes(query))
    );
  }, [searchQuery, registrations, filterType, currentTrainId]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 pb-28 sm:pb-36 bg-slate-50/30 flex flex-col justify-start">
      <div className="max-w-4xl mx-auto w-full space-y-6">

        {/* Title Info Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-right relative overflow-hidden">
          <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
          <div className="flex items-center justify-end space-x-2 text-[#059669] mb-1">
            <h2 className="text-base font-black tracking-wide font-arabic">
              تسجيل كود قائد القطار والرحلات اليومية
            </h2>
            <UserCheck className="w-5 h-5 text-[#059669]" />
          </div>
          <p className="text-xs font-arabic font-medium text-slate-500">
            يرجى تسجيل بيانات قائد القطار ورقم المركبة عند استلام الوردية لضمان المطابقة الأمنية والتشغيلية اليومية تلقائياً
          </p>
        </div>

        {/* Success Message Banner */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-emerald-800 text-sm font-arabic font-bold text-right"
          >
            <button 
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-500 hover:text-emerald-700 font-bold ml-2 focus:outline-none"
            >
              ×
            </button>
            <div className="flex items-center space-x-2 space-x-reverse">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* RIGHT SIDE: Interactive Registration Form (Form is on top or right side) */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-right">
              <h3 className="font-arabic font-black text-slate-900 text-sm border-b border-slate-100 pb-2.5 mb-4 flex items-center justify-end space-x-1.5 space-x-reverse">
                <Plus className="w-4 h-4 text-[#059669]" />
                <span>تسجيل حركة تشغيل جديدة</span>
              </h3>

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Driver ID Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-arabic font-extrabold text-slate-600">
                    كود قائد القطار
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={driverInput}
                      onChange={(e) => setDriverInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#059669] focus:bg-white text-center uppercase"
                      placeholder="مثال: DRV-4089"
                      id="input-driver-panel-code"
                      required
                    />
                  </div>
                </div>

                {/* Train ID Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-arabic font-extrabold text-slate-600">
                    رقم القطار (يتغير يومياً)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={trainInput}
                      onChange={(e) => setTrainInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#059669] focus:bg-white text-center uppercase"
                      placeholder="مثال: TR-012"
                      id="input-train-panel-code"
                      required
                    />
                  </div>
                </div>

                {/* Train Location Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-arabic font-extrabold text-slate-600">
                    موقع القطار الحالي (المحطة)
                  </label>
                  <div className="relative">
                    <select
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#059669] focus:bg-white text-right font-arabic"
                      id="input-train-location"
                      required
                    >
                      <option value="">-- اختر المحطة الحالية للقطار --</option>
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

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 space-x-reverse shadow-md cursor-pointer"
                  id="btn-register-driver-panel"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>تأكيد تسجيل قائد القطار</span>
                </button>
              </form>

              {/* Current Active Badge Display */}
              <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/50 rounded-xl p-3 text-center">
                <span className="text-[10px] font-arabic font-extrabold text-slate-400 block mb-1">بيانات قائد القطار الحالي والموقع النشط</span>
                <div className="flex flex-col items-center justify-center space-y-1.5">
                  <div className="flex items-center justify-center space-x-3 text-xs font-bold text-slate-800">
                    <span className="flex items-center space-x-1">
                      <Train className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{currentTrainId}</span>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center space-x-1">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{currentDriverId}</span>
                    </span>
                  </div>
                  <div className="text-[11px] font-arabic font-extrabold text-[#059669] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center justify-center gap-1.5">
                    <span>📍</span>
                    <span>الموقع الحالي: {currentLocation}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* LEFT SIDE: Logs Database / History */}
          <div className="md:col-span-7 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col h-[415px]">
              
              {/* Filter / Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
                
                {/* Trains and Dates Directory Action Button */}
                <button
                  onClick={() => setShowDirectoryModal(true)}
                  className="text-[11px] font-arabic font-extrabold text-emerald-700 hover:text-white hover:bg-emerald-600 border border-emerald-200 hover:border-emerald-600 bg-emerald-50/70 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 space-x-reverse"
                  title="دليل القطارات والتواريخ"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>دليل القطارات والتواريخ</span>
                </button>

                {/* Search Bar */}
                <div className="relative w-full sm:w-44">
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pr-9 pl-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#059669] focus:bg-white text-right text-[11px] font-bold"
                    placeholder="بحث سريع..."
                  />
                </div>

                <h3 className="font-arabic font-black text-slate-950 text-sm text-right">
                  حركة السائقين اليومية
                </h3>
              </div>

              {/* Segmented Controller to toggle between Current Train or Selected Train filter */}
              <div className="flex items-center justify-end space-x-1.5 space-x-reverse mb-3 bg-slate-100/80 p-1 rounded-xl text-[11px]">
                
                {/* 1. Custom Filter Indicator (if selected from directory) */}
                {filterType !== 'current' && (
                  <div className="flex items-center space-x-1 space-x-reverse px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-arabic font-extrabold shadow-sm">
                    <span>قطار نشط: {filterType}</span>
                    <button
                      onClick={() => setFilterType('current')}
                      className="hover:text-emerald-200 focus:outline-none mr-1 font-bold text-xs cursor-pointer"
                      title="العودة للقطار الحالي"
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* 2. Current Train Button (Default) */}
                <button
                  onClick={() => setFilterType('current')}
                  className={`px-3 py-1.5 rounded-lg font-arabic font-extrabold transition-all cursor-pointer flex items-center space-x-1 space-x-reverse ${
                    filterType === 'current'
                      ? 'bg-white text-emerald-800 shadow-sm border border-emerald-100'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Train className="w-3.5 h-3.5 text-[#059669]" />
                  <span>القطار الحالي للوردية ({currentTrainId})</span>
                </button>
              </div>

              {/* Registration List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-right">
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((log) => (
                    <div
                      key={log.id}
                      className="border border-slate-100 hover:border-slate-200 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between"
                    >
                      {/* Delete / Copy Actions */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="حذف التسجيل"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleCopyEntry(log)}
                          className="p-1.5 text-slate-400 hover:text-[#059669] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="نسخ التفاصيل"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Info & Metadata */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-end space-x-2 space-x-reverse">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-black rounded border border-emerald-100 font-mono">
                            {log.driverId}
                          </span>
                          <span className="text-xs font-arabic font-bold text-slate-850">قائد قطار</span>
                          <span className="text-slate-300">|</span>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-black rounded border border-blue-100 font-mono">
                            {log.trainId}
                          </span>
                          <span className="text-xs font-arabic font-bold text-slate-850">قطار رقم</span>
                        </div>

                        {/* Date, Time and Location */}
                        <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-[10px] font-mono text-slate-400">
                          {log.location && (
                            <span className="flex items-[#059669] space-x-1 space-x-reverse font-arabic font-black bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded">
                              <span>📍</span>
                              <span>{log.location}</span>
                            </span>
                          )}
                          <span className="flex items-center space-x-1 space-x-reverse">
                            <Clock className="w-3 h-3 text-slate-350" />
                            <span>{log.timestamp.split(' ')[1]}</span>
                          </span>
                          <span className="flex items-center space-x-1 space-x-reverse">
                            <Calendar className="w-3 h-3 text-slate-350" />
                            <span>{log.timestamp.split(' ')[0]}</span>
                          </span>
                        </div>
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-400 space-y-2 bg-slate-50/20 rounded-2xl border border-dashed border-slate-200">
                    <UserCheck className="w-8 h-8 text-slate-300" />
                    <p className="font-arabic font-extrabold text-xs text-slate-700">لا توجد تسجيلات مطابقة للتصفية</p>
                    <p className="text-[10px] text-slate-400 font-arabic">
                      {filterType === 'current' 
                        ? `لم يتم تسجيل أي سائقين على القطار الحالي (${currentTrainId}) بعد.`
                        : `لا توجد تسجيلات للقطار المختار.`}
                    </p>
                    {filterType !== 'current' && (
                      <button
                        onClick={() => setFilterType('current')}
                        className="mt-2 text-[10px] font-arabic font-black text-[#059669] hover:underline cursor-pointer"
                      >
                        العودة للقطار الحالي
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* FULL-WIDTH NOTEBOOK & DIRECTORY SECTION */}
        <div className="mt-8 space-y-6" id="notes-fullwidth-section">
          
          {/* Note Input Bar (Full Width Bar) */}
          <div className="bg-gradient-to-r from-emerald-50 via-slate-50 to-emerald-50 border border-emerald-100 rounded-3xl p-5 shadow-sm text-right flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Right Side: Title */}
            <div className="flex items-center gap-2.5 shrink-0 justify-end w-full md:w-auto">
              <div className="bg-emerald-100 text-emerald-800 p-2 rounded-2xl">
                <FileText className="w-5 h-5 text-[#059669]" />
              </div>
              <div className="flex flex-col text-right">
                <span className="font-arabic font-black text-xs text-slate-800">إضافة ملاحظة جديدة للوردية</span>
                <span className="text-[10px] text-slate-500 font-arabic">سيتم تسجيلها فوراً في الدليل أدناه ومزامنتها للشيت تلقائياً</span>
              </div>
            </div>

            {/* Middle: Input field */}
            <form onSubmit={handleAddNote} className="flex-1 w-full flex items-center gap-2.5">
              <input
                type="text"
                value={newNoteDraft}
                onChange={(e) => setNewNoteDraft(e.target.value)}
                placeholder="اكتب أي ملاحظة تشغيلية أو تعليق عام هنا... (مثال: تأخير قطار ٢١ بسبب عطل إشارة، أو تبديل طاقم)"
                className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-emerald-100 text-right font-arabic shadow-inner"
                dir="rtl"
              />
              
              <button
                type="submit"
                disabled={!newNoteDraft.trim()}
                className="px-5 py-3 bg-[#059669] hover:bg-[#047857] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="font-arabic">إضافة للمفكرة</span>
              </button>
            </form>

            {/* Left Side: Sync Actions */}
            <div className="flex items-center gap-2 shrink-0 justify-between md:justify-end w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/50">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFetchNotesClick}
                  disabled={isSyncingSheets || !spreadsheetUrl}
                  type="button"
                  className="px-3.5 py-2 border border-slate-200 hover:bg-slate-100 disabled:bg-slate-50 text-slate-600 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                  title="تحديث ومزامنة الملاحظات من الشيت"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSheets ? 'animate-spin text-emerald-600' : ''}`} />
                  <span className="font-arabic">تحديث من الشيت</span>
                </button>
              </div>

              <span className="text-[10px] font-bold text-slate-500 font-arabic">
                {isSavingNotesStatus === 'saving' && '⏳ جاري الاتصال...'}
                {isSavingNotesStatus === 'saved' && '✅ تم الحفظ والمزامنة!'}
                {isSavingNotesStatus === 'error' && '❌ فشل الاتصال'}
                {isSavingNotesStatus === 'idle' && spreadsheetUrl && '🟢 مزامنة نشطة'}
                {!spreadsheetUrl && '⚠️ يرجى ربط الشيت'}
              </span>
            </div>

          </div>

          {/* Notes Directory Card (دليل الملاحظات) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-right space-y-4">
            
            {/* Header of Directory */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-4">
              
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={notesSearch}
                  onChange={(e) => setNotesSearch(e.target.value)} // Keep sync of search query if they want to filter
                  className="block w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#059669] focus:bg-white text-right text-xs font-bold"
                  placeholder="بحث في الملاحظات والقطارات..."
                />
              </div>

              {/* Title & Badge */}
              <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-850 text-[11px] font-black rounded-lg border border-emerald-100 font-mono">
                  {filteredNotes.length}
                </span>
                <span className="text-slate-400 font-bold text-xs font-arabic">ملاحظة مسجلة</span>
                <span className="text-slate-300">|</span>
                <h3 className="font-arabic font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <span>📚 دليل وسجل الملاحظات العامة للوردية</span>
                </h3>
              </div>

            </div>

            {/* List of Notes (Single unified vertical box list that auto-expands) */}
            <div className="bg-slate-50/50 border border-slate-150 rounded-2xl divide-y divide-slate-100 overflow-hidden">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note, index) => {
                  const isImp = note.isImportant === true;
                  return (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.05, 0.3) }}
                      className={`p-4 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group text-right ${
                        isImp 
                          ? 'bg-amber-50/30 border-r-4 border-r-amber-500 hover:bg-amber-50/70' 
                          : 'hover:bg-white'
                      }`}
                    >
                      {/* Right / Main part: Note Text & Badge */}
                      <div className="flex-1 min-w-0 w-full flex flex-col md:flex-row-reverse items-start md:items-center gap-3">
                        {isImp ? (
                          <span className="shrink-0 px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-black rounded-lg border border-amber-200 font-arabic flex items-center gap-1">
                            ⚠️ تعليمات هامة (الشيت)
                          </span>
                        ) : note.trainId ? (
                          <span className="shrink-0 px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-lg border border-blue-100 font-mono">
                            قطار: {note.trainId}
                          </span>
                        ) : null}
                        
                        <p className={`flex-1 text-xs font-arabic text-slate-800 leading-relaxed text-right break-words w-full ${isImp ? 'font-black text-amber-950' : 'font-bold'}`}>
                          {note.text}
                        </p>
                      </div>

                      {/* Left Part: Meta & Actions */}
                      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto shrink-0 border-t md:border-t-0 border-slate-100 pt-2.5 md:pt-0">
                        
                        {/* Timestamp */}
                        <span className={`flex items-center gap-1.5 text-[10px] font-semibold font-mono font-arabic ${isImp ? 'text-amber-700' : 'text-slate-400'}`}>
                          <Clock className={`w-3.5 h-3.5 ${isImp ? 'text-amber-500' : 'text-slate-300'}`} />
                          <span>{note.timestamp}</span>
                        </span>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(note.text);
                              alert('تم نسخ نص الملاحظة بنجاح!');
                            }}
                            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                            title="نسخ النص"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isImp 
                                ? 'text-slate-300 hover:bg-amber-100/50 hover:text-amber-700' 
                                : 'hover:bg-red-50 text-slate-400 hover:text-red-600'
                            }`}
                            title={isImp ? "تعليمات إدارية غير قابلة للحذف" : "حذف الملاحظة"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400 space-y-2 bg-slate-50/20">
                  <FileText className="w-10 h-10 text-slate-300 animate-pulse" />
                  <p className="font-arabic font-extrabold text-xs text-slate-700">لا توجد ملاحظات مسجلة حالياً</p>
                  <p className="text-[10px] text-slate-400 font-arabic">اكتب ملاحظة جديدة بالبار العلوي للبدء في تدوين الملاحظات الوردية العامة.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Trains & Dates Directory Modal Overlay */}
      {showDirectoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-right"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <button
                onClick={() => setShowDirectoryModal(false)}
                className="text-slate-400 hover:text-white transition-colors text-lg font-bold focus:outline-none cursor-pointer"
              >
                ✕
              </button>
              <div className="flex items-center space-x-2 space-x-reverse">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <h3 className="font-arabic font-black text-base">دليل تشغيل القطارات والتواريخ</h3>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[380px] overflow-y-auto space-y-4">
              <p className="text-xs text-slate-500 font-arabic leading-relaxed">
                انقر على أي قطار بالأسفل لتصفية وعرض السائقين الذين قاموا بقيادته والتواريخ الخاصة بهم بالتفصيل.
              </p>

              <div className="space-y-2.5">
                {trainDirectory.length > 0 ? (
                  trainDirectory.map((train) => (
                    <div
                      key={train.trainId}
                      onClick={() => {
                        setFilterType(train.trainId);
                        setShowDirectoryModal(false);
                      }}
                      className="border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/30 rounded-2xl p-4 transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
                    >
                      {/* Top Row: Train ID & Selection Action */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-arabic font-black text-emerald-600 group-hover:translate-x-[-4px] transition-transform flex items-center space-x-1 space-x-reverse">
                          <span>عرض حركة السائقين</span>
                          <span>←</span>
                        </span>
                        
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-800 text-xs font-black rounded-lg border border-blue-100 font-mono">
                            {train.trainId}
                          </span>
                          <span className="text-xs font-arabic font-black text-slate-800">قطار رقم</span>
                          <Train className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>

                      {/* Dates Active list */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 justify-end items-center">
                        {train.dates.map((d) => (
                          <span key={d} className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-500">
                            <Calendar className="w-2.5 h-2.5 text-slate-400 mr-1" />
                            {d}
                          </span>
                        ))}
                        <span className="text-[10px] font-arabic font-extrabold text-slate-400 ml-2">أيام التشغيل:</span>
                      </div>

                      {/* Driver Summary */}
                      <div className="text-[10px] text-slate-500 font-arabic pt-0.5">
                        السائقون: <strong className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{train.drivers.join(', ')}</strong>
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 font-arabic text-xs">
                    لا توجد بيانات قطارات مسجلة حالياً. يرجى تسجيل حركة جديدة.
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-100">
              <button
                onClick={() => setShowDirectoryModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-arabic font-bold transition-all cursor-pointer"
              >
                إغلاق النافذة
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
