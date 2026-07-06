import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SopList from './components/SopList';
import SopWizard from './components/SopWizard';
import ShiftLogsModal from './components/ShiftLogsModal';
import SopSearch from './components/SopSearch';
import SopFavorites from './components/SopFavorites';
import DriverCodePanel from './components/DriverCodePanel';
import { SOPS_DATA } from './data';
import { SOP, DriverShiftLog, DriverRegistrationLog } from './types';
import { 
  Play, RotateCcw, AlertTriangle, ShieldCheck, Home, 
  Layers, Search, Heart, FileText, ClipboardList, UserCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from 'firebase/auth';
import { 
  initAuth, googleSignIn, logout as googleLogout, createNewSpreadsheet, appendLogToSpreadsheet,
  fetchNotesFromSpreadsheet, saveNotesToSpreadsheet, updateLastRegistrationNoteInSpreadsheet
} from './lib/googleSheets';

export default function App() {
  // Navigation & Tab States
  const [screen, setScreen] = useState<'dashboard' | 'category' | 'wizard'>('dashboard');
  const [activeTab, setActiveTab] = useState<'home' | 'procedures' | 'search' | 'favorites' | 'driver_code'>('home');
  const [selectedCategory, setSelectedCategory] = useState<'normal' | 'degraded' | 'emergency' | 'troubleshooting' | null>(null);
  const [selectedSop, setSelectedSop] = useState<SOP | null>(null);

  // Driver badge & vehicle registration
  const [driverId, setDriverId] = useState<string>(() => {
    return localStorage.getItem('lrt_driver_id') || 'DRV-4089';
  });
  const [trainId, setTrainId] = useState<string>(() => {
    return localStorage.getItem('lrt_train_id') || 'TR-012';
  });
  const [trainLocation, setTrainLocation] = useState<string>(() => {
    return localStorage.getItem('lrt_train_location') || 'محطة عدلى منصور';
  });

  // Shift logs list
  const [logs, setLogs] = useState<DriverShiftLog[]>(() => {
    const saved = localStorage.getItem('lrt_shift_logs');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLogsOpen, setIsLogsOpen] = useState(false);

  // Starred / Favorite procedures state
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('lrt_sop_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Active step survival state (Resumable Session)
  const [activeSession, setActiveSession] = useState<{
    sopCode: string;
    currentNodeId: string;
    history: string[];
  } | null>(() => {
    const saved = localStorage.getItem('lrt_active_sop_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Google Sheets state integration
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(() => {
    return localStorage.getItem('lrt_spreadsheet_url');
  });
  const [spreadsheetName, setSpreadsheetName] = useState<string | null>(() => {
    return localStorage.getItem('lrt_spreadsheet_name');
  });
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [sheetsError, setSheetsError] = useState<string | null>(null);

  // General Notes State (Two-Way Sync with Google Sheets)
  const [generalNotes, setGeneralNotes] = useState<string>(() => {
    return localStorage.getItem('lrt_general_notes') || '';
  });

  // Current Notes State (Cleared ONLY when Train ID changes)
  const [currentNotes, setCurrentNotes] = useState<string>(() => {
    return localStorage.getItem('lrt_current_notes') || '';
  });

  // Important Management Instructions (Synced from Column C in 'ملاحظات الوردية')
  const [importantInstructions, setImportantInstructions] = useState<string[]>(() => {
    const saved = localStorage.getItem('lrt_important_instructions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lrt_general_notes', generalNotes);
  }, [generalNotes]);

  useEffect(() => {
    localStorage.setItem('lrt_current_notes', currentNotes);
  }, [currentNotes]);

  useEffect(() => {
    localStorage.setItem('lrt_important_instructions', JSON.stringify(importantInstructions));
  }, [importantInstructions]);

  // Clear current notes ONLY when Train ID changes
  const prevTrainIdRef = useRef<string>(trainId);
  useEffect(() => {
    if (prevTrainIdRef.current !== trainId) {
      setCurrentNotes('');
      localStorage.setItem('lrt_current_notes', '');
      // If we are logged in, sync the empty currentNotes to the spreadsheet
      const savedSheetId = localStorage.getItem('lrt_spreadsheet_id');
      if (googleToken && savedSheetId) {
        handleSaveNotes(generalNotes, '');
      }
      prevTrainIdRef.current = trainId;
    }
  }, [trainId, googleToken, generalNotes]);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
        setSheetsError(null);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    setIsSyncingSheets(true);
    setSheetsError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setSheetsError('فشل تسجيل الدخول باستخدام حساب Google. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSyncingSheets(false);
    }
  };

  const handleGoogleLogout = async () => {
    setIsSyncingSheets(true);
    try {
      await googleLogout();
      setGoogleUser(null);
      setGoogleToken(null);
      setSpreadsheetUrl(null);
      setSpreadsheetName(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncingSheets(false);
    }
  };

  const handleCreateNewSheet = async () => {
    if (!googleToken) return;
    setIsSyncingSheets(true);
    setSheetsError(null);
    try {
      const sheet = await createNewSpreadsheet(googleToken);
      setSpreadsheetUrl(sheet.url);
      setSpreadsheetName(sheet.name);
    } catch (err: any) {
      console.error(err);
      setSheetsError('فشل إنشاء ورقة Google Sheet جديدة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSyncingSheets(false);
    }
  };

  // Fetch general & current notes from Google Sheets
  const handleFetchNotes = async (): Promise<void> => {
    const savedSheetId = localStorage.getItem('lrt_spreadsheet_id');
    if (!googleToken || !savedSheetId) return;
    try {
      const remote = await fetchNotesFromSpreadsheet(savedSheetId, googleToken);
      if (remote) {
        setGeneralNotes(remote.generalNotes || '');
        setCurrentNotes(remote.currentNotes || '');
        if (remote.importantInstructions) {
          setImportantInstructions(remote.importantInstructions);
        }
      }
    } catch (err) {
      console.error('Failed to fetch general & current notes:', err);
    }
  };

  // Save general & current notes to Google Sheets
  const handleSaveNotes = async (genNotes: string, curNotes: string, addedNoteText?: string): Promise<boolean> => {
    const savedSheetId = localStorage.getItem('lrt_spreadsheet_id');
    if (!googleToken || !savedSheetId) return false;
    try {
      setIsSyncingSheets(true);
      const success = await saveNotesToSpreadsheet(savedSheetId, googleToken, genNotes, curNotes);
      if (success) {
        setGeneralNotes(genNotes);
        setCurrentNotes(curNotes);

        // If there is an added note, update the active registration row in the sheet directly!
        if (addedNoteText) {
          await updateLastRegistrationNoteInSpreadsheet(
            savedSheetId,
            googleToken,
            driverId,
            trainId,
            addedNoteText
          );
        }

        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to save general & current notes:', err);
      return false;
    } finally {
      setIsSyncingSheets(false);
    }
  };

  // Auto poll notes from Google Sheets when connected
  useEffect(() => {
    const savedSheetId = localStorage.getItem('lrt_spreadsheet_id');
    if (googleToken && savedSheetId) {
      // Fetch once initially
      handleFetchNotes();

      // Poll every 15 seconds
      const interval = setInterval(() => {
        handleFetchNotes();
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [googleToken, spreadsheetUrl]);

  const handleSyncAllHistory = async () => {
    const savedSheetId = localStorage.getItem('lrt_spreadsheet_id');
    if (!googleUser || !googleToken || !savedSheetId) {
      alert('الرجاء ربط حساب Google وإنشاء الشيت أولاً');
      return;
    }

    const localRegs: DriverRegistrationLog[] = JSON.parse(
      localStorage.getItem('lrt_driver_registrations') || '[]'
    );

    const confirmSync = window.confirm(
      `هل تريد مزامنة جميع البيانات المسجلة محلياً (${logs.length} سجل إجراءات و ${localRegs.length} سجل حركة قطارات) إلى Google Sheets؟ قد يستغرق هذا بضع ثوانٍ.`
    );
    if (!confirmSync) return;

    setIsSyncingSheets(true);
    setSheetsError(null);

    try {
      // Sync Registrations
      for (const reg of localRegs) {
        await appendLogToSpreadsheet(savedSheetId, googleToken, {
          id: reg.id,
          timestamp: reg.timestamp,
          driverId: reg.driverId,
          trainId: reg.trainId,
          location: reg.location || '-',
          logType: 'تسجيل وردية جديدة',
          sopCode: '-',
          sopTitle: '-',
          outcome: `تم استلام الوردية بنجاح على القطار رقم ${reg.trainId}`,
          notes: 'مزامنة يدوية من أرشيف التابلت'
        });
      }

      // Sync Shift Logs
      for (const log of logs) {
        await appendLogToSpreadsheet(savedSheetId, googleToken, {
          id: log.id,
          timestamp: log.timestamp,
          driverId: driverId,
          trainId: trainId,
          location: log.location || trainLocation || '-',
          logType: 'إنهاء إجراء سلامة',
          sopCode: log.sopCode,
          sopTitle: log.sopTitle,
          outcome: log.outcome,
          notes: log.notes || 'مزامنة يدوية من أرشيف التابلت'
        });
      }

      alert('تمت مزامنة جميع السجلات التاريخية بنجاح إلى شيت Google Excel!');
    } catch (err: any) {
      console.error('Sync failed:', err);
      setSheetsError('فشلت المزامنة، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSyncingSheets(false);
    }
  };

  const handleRegisterToSheetsDirectly = async (reg: DriverRegistrationLog) => {
    const savedSheetId = localStorage.getItem('lrt_spreadsheet_id');
    if (googleUser && googleToken && savedSheetId) {
      setIsSyncingSheets(true);
      try {
        await appendLogToSpreadsheet(savedSheetId, googleToken, {
          id: reg.id,
          timestamp: reg.timestamp,
          driverId: reg.driverId,
          trainId: reg.trainId,
          location: reg.location || '-',
          logType: 'تسجيل وردية جديدة',
          sopCode: '-',
          sopTitle: '-',
          outcome: `تم استلام الوردية بنجاح على القطار رقم ${reg.trainId}`,
          notes: 'تسجيل دخول وتأكيد كود قائد القطار'
        });
      } catch (err: any) {
        console.error('Failed to sync registration to Sheets:', err);
      } finally {
        setIsSyncingSheets(false);
      }
    }
  };

  // Auto-save Driver registrations
  useEffect(() => {
    localStorage.setItem('lrt_driver_id', driverId);
  }, [driverId]);

  useEffect(() => {
    localStorage.setItem('lrt_train_id', trainId);
  }, [trainId]);

  useEffect(() => {
    localStorage.setItem('lrt_train_location', trainLocation);
  }, [trainLocation]);

  // Auto-save Shift Logs
  useEffect(() => {
    localStorage.setItem('lrt_shift_logs', JSON.stringify(logs));
  }, [logs]);

  // Auto-save Favorites list
  useEffect(() => {
    localStorage.setItem('lrt_sop_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Handle category tile selection (Home ➔ Procedures tab)
  const handleSelectCategory = (category: 'normal' | 'degraded' | 'emergency' | 'troubleshooting') => {
    setSelectedCategory(category);
    setScreen('category');
    setActiveTab('procedures');
  };

  // Toggle favorite status
  const handleToggleFavorite = (sopCode: string) => {
    setFavorites(prev => {
      if (prev.includes(sopCode)) {
        return prev.filter(c => c !== sopCode);
      } else {
        return [...prev, sopCode];
      }
    });
  };

  // Handle SOP launch (SOP ➔ Fullscreen Wizard)
  const handleSelectSop = (sop: SOP) => {
    setSelectedSop(sop);
    setScreen('wizard');
    
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60000;
    const localDate = new Date(now.getTime() - offsetMs);
    const openingTime = localDate.toISOString().replace('T', ' ').substring(0, 19);

    // Add an 'opened' log entry
    setLogs(prev => {
      const alreadyOpened = prev.some(l => l.sopCode === sop.sop_code && l.status === 'opened');
      if (alreadyOpened) return prev;

      const newLog: DriverShiftLog = {
        id: `log-${Date.now()}`,
        timestamp: openingTime,
        openTimestamp: openingTime,
        status: 'opened',
        sopCode: sop.sop_code,
        sopTitle: sop.title_en,
        location: trainLocation,
        outcome: 'Procedure opened on tablet. Awaiting driver decision completion.'
      };
      return [newLog, ...prev];
    });

    // Initialize or restore active session
    const restoredSop = activeSession && activeSession.sopCode === sop.sop_code;
    const initialNode = restoredSop ? activeSession.currentNodeId : 'start';
    const initialHistory = restoredSop ? activeSession.history : [];

    // Save active state to localStorage for persistence
    localStorage.setItem('lrt_active_sop_session', JSON.stringify({
      sopCode: sop.sop_code,
      currentNodeId: initialNode,
      history: initialHistory
    }));
  };

  // Resume the active session found in storage
  const handleResumeActiveSession = () => {
    if (!activeSession) return;
    const sop = SOPS_DATA.find(s => s.sop_code === activeSession.sopCode);
    if (sop) {
      setSelectedSop(sop);
      setScreen('wizard');
    }
  };

  // Discard active session
  const handleClearActiveSession = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem('lrt_active_sop_session');
    setActiveSession(null);
  };

  // Submit and register shift logs
  const handleLogCompleted = async (logData: Omit<DriverShiftLog, 'id' | 'timestamp'> & { notes?: string }) => {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60000;
    const localDate = new Date(now.getTime() - offsetMs);
    const completionTime = localDate.toISOString().replace('T', ' ').substring(0, 19);
    
    const newLogId = `log-${Date.now()}`;
    const newLog: DriverShiftLog = {
      id: newLogId,
      timestamp: completionTime,
      openTimestamp: completionTime,
      status: 'completed',
      sopCode: logData.sopCode,
      sopTitle: logData.sopTitle,
      location: trainLocation,
      outcome: logData.outcome,
      notes: logData.notes
    };

    setLogs(prev => {
      const updated = [...prev];
      const openedIndex = updated.findIndex(l => l.sopCode === logData.sopCode && l.status === 'opened');
      if (openedIndex !== -1) {
        updated[openedIndex] = {
          ...updated[openedIndex],
          status: 'completed',
          timestamp: completionTime,
          location: trainLocation,
          outcome: logData.outcome,
          notes: logData.notes
        };
        return updated;
      } else {
        return [newLog, ...prev];
      }
    });
    
    setIsLogsOpen(true);

    // Clear active wizard survival states
    localStorage.removeItem('lrt_active_sop_session');
    setActiveSession(null);

    // Auto-append to Google Sheet if connected
    const savedSheetId = localStorage.getItem('lrt_spreadsheet_id');
    if (googleUser && googleToken && savedSheetId) {
      setIsSyncingSheets(true);
      try {
        await appendLogToSpreadsheet(savedSheetId, googleToken, {
          id: newLog.id,
          timestamp: completionTime,
          driverId: driverId,
          trainId: trainId,
          location: trainLocation,
          logType: 'إنهاء إجراء سلامة',
          sopCode: logData.sopCode,
          sopTitle: logData.sopTitle,
          outcome: logData.outcome,
          notes: logData.notes || ''
        });
      } catch (err: any) {
        console.error('Failed to auto-sync checklist to Google Sheets:', err);
      } finally {
        setIsSyncingSheets(false);
      }
    }
  };

  // Reset shift logs
  const handleClearAllLogs = () => {
    if (window.confirm("Are you sure you want to delete all logged procedures for this shift?")) {
      setLogs([]);
      localStorage.removeItem('lrt_shift_logs');
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans">
      
      {/* Dynamic Native Tablet Header */}
      <Header
        driverId={driverId}
        setDriverId={setDriverId}
        trainId={trainId}
        setTrainId={setTrainId}
        trainLocation={trainLocation}
        setTrainLocation={setTrainLocation}
        logsCount={logs.length}
        onOpenLogs={() => setIsLogsOpen(true)}
        onGoHome={() => {
          setActiveTab('home');
          setScreen('dashboard');
        }}
        googleUser={googleUser}
        spreadsheetUrl={spreadsheetUrl}
        spreadsheetName={spreadsheetName}
        isSyncingSheets={isSyncingSheets}
        sheetsError={sheetsError}
        onGoogleLogin={handleGoogleLogin}
        onGoogleLogout={handleGoogleLogout}
        onCreateNewSheet={handleCreateNewSheet}
        onSyncAllHistory={handleSyncAllHistory}
      />

      {/* Dynamic Active Session Interrupted Banner */}
      {activeSession && screen === 'dashboard' && activeTab === 'home' && (
        <div className="bg-gradient-to-r from-amber-600 to-yellow-600 border-b border-amber-500 text-slate-950 px-6 py-3 shrink-0 flex items-center justify-between shadow-lg z-30">
          <div className="flex items-center space-x-3 text-left">
            <AlertTriangle className="w-5 h-5 text-slate-950 animate-bounce" />
            <div>
              <p className="font-extrabold text-xs tracking-tight">
                ACTIVE UNFINISHED INCIDENT SESSION RECOVERED
              </p>
              <p className="text-[10px] font-semibold opacity-90 leading-none mt-0.5">
                The driver tablet recovered progress for procedure: <strong className="font-mono">{activeSession.sopCode}</strong>.
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleClearActiveSession}
              className="px-3 py-1 bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 font-bold rounded text-[10px] uppercase transition-colors"
              id="btn-discard-session"
            >
              Discard
            </button>
            <button
              onClick={handleResumeActiveSession}
              className="px-4 py-1.5 bg-slate-950 text-white font-extrabold rounded-lg text-xs shadow-md flex items-center space-x-1 hover:bg-slate-900 transition-colors"
              id="btn-resume-session"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>RESUME PROCEDURAL STEPS</span>
            </button>
          </div>
        </div>
      )}

      {/* Screen/Tab Router Panel */}
      <main className="flex-1 overflow-hidden flex flex-col relative">
        <AnimatePresence mode="wait">
          
          {/* 1. HOME TAB */}
          {screen !== 'wizard' && activeTab === 'home' && (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <Dashboard onSelectCategory={handleSelectCategory} />
            </motion.div>
          )}

          {/* 2. PROCEDURES LIST TAB */}
          {screen !== 'wizard' && activeTab === 'procedures' && (
            <motion.div
              key="tab-procedures"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <SopList
                category={selectedCategory || 'normal'}
                sops={SOPS_DATA}
                onBack={() => {
                  setActiveTab('home');
                  setScreen('dashboard');
                }}
                onSelectSop={handleSelectSop}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            </motion.div>
          )}

          {/* 3. SEARCH TAB */}
          {screen !== 'wizard' && activeTab === 'search' && (
            <motion.div
              key="tab-search"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <SopSearch sops={SOPS_DATA} onSelectSop={handleSelectSop} />
            </motion.div>
          )}

          {/* 4. FAVORITES TAB */}
          {screen !== 'wizard' && activeTab === 'favorites' && (
            <motion.div
              key="tab-favorites"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <SopFavorites
                sops={SOPS_DATA}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onSelectSop={handleSelectSop}
              />
            </motion.div>
          )}

          {/* DRIVER CODE / BADGE REGISTRATION TAB */}
          {screen !== 'wizard' && activeTab === 'driver_code' && (
            <motion.div
              key="tab-driver-code"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <DriverCodePanel
                currentDriverId={driverId}
                currentTrainId={trainId}
                currentLocation={trainLocation}
                onUpdateDriverId={setDriverId}
                onUpdateTrainId={setTrainId}
                onUpdateLocation={setTrainLocation}
                googleUser={googleUser}
                spreadsheetUrl={spreadsheetUrl}
                spreadsheetName={spreadsheetName}
                isSyncingSheets={isSyncingSheets}
                sheetsError={sheetsError}
                onGoogleLogin={handleGoogleLogin}
                onGoogleLogout={handleGoogleLogout}
                onCreateNewSheet={handleCreateNewSheet}
                onSyncAllHistory={handleSyncAllHistory}
                onRegisterToSheetsDirectly={handleRegisterToSheetsDirectly}
                generalNotes={generalNotes}
                setGeneralNotes={setGeneralNotes}
                currentNotes={currentNotes}
                setCurrentNotes={setCurrentNotes}
                onSaveNotes={handleSaveNotes}
                onFetchNotes={handleFetchNotes}
                importantInstructions={importantInstructions}
              />
            </motion.div>
          )}

          {/* 5. FULLSCREEN STEP-BY-STEP WIZARD RUNNING */}
          {screen === 'wizard' && selectedSop && (
            <motion.div
              key="active-wizard-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col overflow-hidden z-20"
            >
              <SopWizard
                sop={selectedSop}
                onGoHome={() => {
                  setActiveTab('home');
                  setScreen('dashboard');
                }}
                onBackToIndex={() => {
                  setActiveTab('procedures');
                  setScreen('category');
                }}
                onLogCompleted={handleLogCompleted}
              />
            </motion.div>
          )}

        </AnimatePresence>

        {/* FLOATING ARABIC BOTTOM NAVIGATION BAR exactly matching the screenshot */}
        {screen !== 'wizard' && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white border border-slate-200 shadow-xl rounded-full px-5 py-2.5 flex items-center justify-around z-40 max-w-lg w-[calc(100%-2.5rem)]">
            
            {/* 1. السجل (Shift Logs / Ledger) */}
            <button
              onClick={() => setIsLogsOpen(true)}
              className="flex flex-col items-center justify-center space-y-1 relative text-slate-450 hover:text-slate-800 transition-colors focus:outline-none cursor-pointer group min-w-[56px]"
              title="سجل العمليات"
              id="nav-btn-logs"
            >
              <div className="relative">
                <ClipboardList className="w-5 h-5 text-slate-500 group-hover:text-slate-800 transition-colors" />
                {logs.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-white text-[9px] font-mono font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white shadow-sm">
                    {logs.length}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-arabic font-bold text-slate-450 group-hover:text-slate-800 leading-none">
                السجل
              </span>
            </button>

            {/* 2. المفضلة (Starred Procedures) */}
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors focus:outline-none cursor-pointer min-w-[56px] ${
                activeTab === 'favorites' ? 'text-[#059669]' : 'text-slate-450 hover:text-slate-800'
              }`}
              title="المفضلة"
              id="nav-btn-favorites"
            >
              <Heart className={`w-5 h-5 ${activeTab === 'favorites' ? 'text-[#059669] fill-current' : 'text-slate-500'}`} />
              <span className="text-[10px] font-arabic font-bold leading-none">
                المفضلة
              </span>
            </button>

            {/* 3. بحث (Search Guidebook) */}
            <button
              onClick={() => setActiveTab('search')}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors focus:outline-none cursor-pointer min-w-[56px] ${
                activeTab === 'search' ? 'text-[#059669]' : 'text-slate-450 hover:text-slate-800'
              }`}
              title="بحث"
              id="nav-btn-search"
            >
              <Search className={`w-5 h-5 ${activeTab === 'search' ? 'text-[#059669]' : 'text-slate-500'}`} />
              <span className="text-[10px] font-arabic font-bold leading-none">
                بحث
              </span>
            </button>

            {/* 4. كود قائد القطار (Driver Badge/Code) */}
            <button
              onClick={() => {
                setActiveTab('driver_code');
                setScreen('dashboard');
              }}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors focus:outline-none cursor-pointer min-w-[56px] ${
                activeTab === 'driver_code' ? 'text-[#059669]' : 'text-slate-450 hover:text-slate-800'
              }`}
              title="كود قائد القطار"
              id="nav-btn-driver-code"
            >
              <UserCheck className={`w-5 h-5 ${activeTab === 'driver_code' ? 'text-[#059669]' : 'text-slate-500'}`} />
              <span className="text-[10px] font-arabic font-bold leading-none">
                كود قائد القطار
              </span>
            </button>

            {/* 5. الرئيسية (Home Dashboard) */}
            <button
              onClick={() => {
                setActiveTab('home');
                setScreen('dashboard');
              }}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors focus:outline-none cursor-pointer min-w-[56px] ${
                activeTab === 'home' ? 'text-[#059669]' : 'text-slate-450 hover:text-slate-800'
              }`}
              title="الرئيسية"
              id="nav-btn-home"
            >
              <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-[#059669]' : 'text-slate-500'}`} />
              <span className="text-[10px] font-arabic font-bold leading-none">
                الرئيسية
              </span>
            </button>

          </div>
        )}
      </main>

      {/* Driver Shift Logs Modal Overlay Repository */}
      <ShiftLogsModal
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
        logs={logs}
        onClearLogs={handleClearAllLogs}
      />

    </div>
  );
}
