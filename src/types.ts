export interface MetadataCard {
  type: 'point_of_attention' | 'safety_point';
  text_ar: string;
  text_en?: string; // We can add English as well for completeness!
}

export interface FlowchartNode {
  type?: 'question' | 'action' | 'end'; // default is 'action' if not specified
  text_ar: string;
  text_en?: string; // English translation for full bilingual driver experience
  linked_metadata?: string[]; // references to metadata keys (e.g., ['S1', 'P1'])
  yes?: string; // next node if YES
  no?: string;  // next node if NO
  next?: string; // next node if simple action with single next state
  style?: string; // custom styling
}

export interface SOP {
  sop_code: string;
  category: 'normal' | 'degraded' | 'emergency' | 'troubleshooting';
  title_en: string;
  title_ar: string;
  reference_documents: string[];
  metadata: Record<string, MetadataCard>;
  flowchart: Record<string, FlowchartNode>;
}

export interface ActiveSession {
  sopCode: string;
  currentNodeId: string;
  history: string[]; // for undo / back-stepping
}

export interface DriverShiftLog {
  id: string;
  timestamp: string; // last action / recorded timestamp
  openTimestamp?: string; // تاريخ الفتح (open timestamp)
  status?: 'opened' | 'completed'; // Whether it is currently opened/active or completed
  sopCode: string;
  sopTitle: string;
  outcome: string;
  notes?: string;
  location?: string;
}

export interface DriverRegistrationLog {
  id: string;
  driverId: string;
  trainId: string;
  timestamp: string; // e.g. "2026-06-29 12:17:58"
  location?: string;
}
