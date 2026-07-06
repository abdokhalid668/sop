import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/drive.file');

let isSigningIn = false;
let cachedAccessToken: string | null = localStorage.getItem('lrt_google_token');

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else {
        // If we don't have the token in memory, check if we can retrieve it
        const savedToken = localStorage.getItem('lrt_google_token');
        if (savedToken) {
          cachedAccessToken = savedToken;
          if (onAuthSuccess) onAuthSuccess(user, savedToken);
        } else {
          if (onAuthFailure) onAuthFailure();
        }
      }
    } else {
      cachedAccessToken = null;
      localStorage.removeItem('lrt_google_token');
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with Google to get the required OAuth scopes
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Google Auth provider.');
    }

    cachedAccessToken = credential.accessToken;
    localStorage.setItem('lrt_google_token', cachedAccessToken);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
  localStorage.removeItem('lrt_google_token');
  localStorage.removeItem('lrt_spreadsheet_id');
  localStorage.removeItem('lrt_spreadsheet_url');
  localStorage.removeItem('lrt_spreadsheet_name');
};

// Create a new Google Spreadsheet
export const createNewSpreadsheet = async (token: string): Promise<{ id: string; url: string; name: string }> => {
  const title = 'SOP Train Driver Logs - سجل تشغيل قطارات LRT';
  const sheetTitle = 'سجل التشغيل والأعطال';

  try {
    const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: title
        },
        sheets: [
          {
            properties: {
              title: sheetTitle
            }
          }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to create spreadsheet: ${errText}`);
    }

    const data = await response.json();
    const spreadsheetId = data.spreadsheetId;
    const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    const firstSheetId = data.sheets?.[0]?.properties?.sheetId;

    // Now write the headers to the spreadsheet
    await initializeSpreadsheetHeaders(spreadsheetId, token, sheetTitle);

    if (firstSheetId !== undefined && firstSheetId !== null) {
      await formatSpreadsheetTab(spreadsheetId, token, firstSheetId);
    }

    localStorage.setItem('lrt_spreadsheet_id', spreadsheetId);
    localStorage.setItem('lrt_spreadsheet_url', spreadsheetUrl);
    localStorage.setItem('lrt_spreadsheet_name', title);

    return { id: spreadsheetId, url: spreadsheetUrl, name: title };
  } catch (error) {
    console.error('Error creating Google Sheet:', error);
    throw error;
  }
};

// Format a specific sheet tab (Set column sizes and colors)
export const formatSpreadsheetTab = async (
  spreadsheetId: string,
  token: string,
  sheetId: number
): Promise<boolean> => {
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          // 1. Column Widths
          {
            updateDimensionProperties: {
              range: {
                sheetId: sheetId,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: 5
              },
              properties: {
                pixelSize: 130
              },
              fields: 'pixelSize'
            }
          },
          {
            updateDimensionProperties: {
              range: {
                sheetId: sheetId,
                dimension: 'COLUMNS',
                startIndex: 5,
                endIndex: 7
              },
              properties: {
                pixelSize: 480 // 480px wide for Comments/Notes to display fully
              },
              fields: 'pixelSize'
            }
          },
          // 2. Header Style (Slate-900 theme, bold, white text, centered)
          {
            repeatCell: {
              range: {
                sheetId: sheetId,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: 7
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.058,  // Slate 900
                    green: 0.09,
                    blue: 0.16
                  },
                  horizontalAlignment: 'CENTER',
                  verticalAlignment: 'MIDDLE',
                  textFormat: {
                    foregroundColor: {
                      red: 1.0,
                      green: 1.0,
                      blue: 1.0
                    },
                    fontSize: 11,
                    bold: true
                  }
                }
              },
              fields: 'userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,textFormat)'
            }
          },
          // 3. Grid cell alignments (center both vertically and horizontally)
          {
            repeatCell: {
              range: {
                sheetId: sheetId,
                startRowIndex: 1,
                endRowIndex: 1000,
                startColumnIndex: 0,
                endColumnIndex: 7
              },
              cell: {
                userEnteredFormat: {
                  horizontalAlignment: 'CENTER',
                  verticalAlignment: 'MIDDLE',
                  textFormat: {
                    fontSize: 10,
                    foregroundColor: {
                      red: 0.1,
                      green: 0.1,
                      blue: 0.1
                    }
                  }
                }
              },
              fields: 'userEnteredFormat(horizontalAlignment,verticalAlignment,textFormat)'
            }
          },
          // 4. Strong borders for rows and columns (thick and high contrast grid lines)
          {
            updateBorders: {
              range: {
                sheetId: sheetId,
                startRowIndex: 0,
                endRowIndex: 1000,
                startColumnIndex: 0,
                endColumnIndex: 7
              },
              top: {
                style: 'SOLID_MEDIUM',
                color: {
                  red: 0.12,
                  green: 0.16,
                  blue: 0.23
                }
              },
              bottom: {
                style: 'SOLID_MEDIUM',
                color: {
                  red: 0.12,
                  green: 0.16,
                  blue: 0.23
                }
              },
              left: {
                style: 'SOLID_MEDIUM',
                color: {
                  red: 0.12,
                  green: 0.16,
                  blue: 0.23
                }
              },
              right: {
                style: 'SOLID_MEDIUM',
                color: {
                  red: 0.12,
                  green: 0.16,
                  blue: 0.23
                }
              },
              innerHorizontal: {
                style: 'SOLID',
                color: {
                  red: 0.2,
                  green: 0.2,
                  blue: 0.2
                }
              },
              innerVertical: {
                style: 'SOLID',
                color: {
                  red: 0.2,
                  green: 0.2,
                  blue: 0.2
                }
              }
            }
          }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Failed to format tab properties:', errText);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error formatting tab properties:', error);
    return false;
  }
};

// Write initial headers
const initializeSpreadsheetHeaders = async (spreadsheetId: string, token: string, sheetTitle: string) => {
  const range = `${sheetTitle}!A1:G1`;
  const headers = [
    'رقم القطار',
    'كود سائق القطار',
    'التاريخ',
    'الوقت',
    'الموقع',
    'ملاحظات',
    'ملاحظات قائد القطار'
  ];

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: range,
          majorDimension: 'ROWS',
          values: [headers]
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Could not write header row:', errText);
    }
  } catch (err) {
    console.error('Error writing headers to Google Sheet:', err);
  }
};

// Ensure a specific sheet tab exists, if not, create it and initialize headers
export const ensureSheetExists = async (
  spreadsheetId: string,
  token: string,
  sheetTitle: string
): Promise<boolean> => {
  try {
    const metaResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title,sheets.properties.sheetId`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!metaResponse.ok) {
      console.error('Failed to fetch spreadsheet metadata');
      return false;
    }

    const metaData = await metaResponse.json();
    const sheets = metaData.sheets || [];

    const foundSheet = sheets.find((s: any) => s.properties?.title === sheetTitle);

    if (foundSheet) {
      const sheetId = foundSheet.properties?.sheetId;
      if (sheetId !== undefined && sheetId !== null) {
        // Run styling on existing tab so previous files can also get columns widened & color formatted immediately
        await formatSpreadsheetTab(spreadsheetId, token, sheetId);
      }
      return true;
    }

    // Sheet doesn't exist, create it
    const createResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetTitle
              }
            }
          }
        ]
      })
    });

    if (!createResponse.ok) {
      const errText = await createResponse.text();
      console.error('Failed to create sheet tab:', errText);
      return false;
    }

    const createData = await createResponse.json();
    const newSheetId = createData.replies?.[0]?.addSheet?.properties?.sheetId;

    // Wait a tiny bit and initialize headers
    await initializeSpreadsheetHeaders(spreadsheetId, token, sheetTitle);

    if (newSheetId !== undefined && newSheetId !== null) {
      await formatSpreadsheetTab(spreadsheetId, token, newSheetId);
    }
    return true;
  } catch (err) {
    console.error('Error in ensureSheetExists:', err);
    return false;
  }
};

// Log a row to the spreadsheet
export interface LogRowParams {
  id: string;
  timestamp: string;
  driverId: string;
  trainId: string;
  location?: string;
  logType: 'تسجيل وردية جديدة' | 'إنهاء إجراء سلامة' | 'تدوين ملاحظة عامة';
  sopCode: string;
  sopTitle: string;
  outcome: string;
  notes: string;
  driverNotes?: string;
}

export const appendLogToSpreadsheet = async (
  spreadsheetId: string,
  token: string,
  row: LogRowParams
): Promise<boolean> => {
  const trainNum = row.trainId ? row.trainId.trim() : 'عام';
  const sheetTitle = `القطار رقم ${trainNum}`;

  // Dynamically ensure sheet tab exists for this train
  const isReady = await ensureSheetExists(spreadsheetId, token, sheetTitle);
  if (!isReady) {
    console.warn(`Could not ensure sheet tab exists for ${sheetTitle}, logging to default sheet`);
  }

  const activeSheetTitle = isReady ? sheetTitle : 'سجل التشغيل والأعطال';
  const range = `${activeSheetTitle}!A1`;

  // Parse Date and Time from timestamp (Format: YYYY-MM-DD HH:MM:SS)
  let datePart = '-';
  let timePart = '-';
  if (row.timestamp) {
    const parts = row.timestamp.trim().split(' ');
    if (parts.length >= 2) {
      datePart = parts[0];
      timePart = parts[1];
    } else {
      datePart = row.timestamp;
    }
  }

  // Format Notes and Data beautifully
  let notesPart = '';
  if (row.logType === 'تسجيل وردية جديدة') {
    notesPart = `تسجيل وردية جديدة | تم استلام الوردية بنجاح على القطار رقم ${row.trainId}. ${row.notes ? `[ملاحظة: ${row.notes}]` : ''}`;
  } else if (row.logType === 'تدوين ملاحظة عامة') {
    notesPart = `تدوين ملاحظة في سجل ومفكرة الوردية العامة: ${row.notes}`;
  } else {
    notesPart = `إجراء سلامة: [${row.sopCode} - ${row.sopTitle}] | النتيجة: ${row.outcome} ${row.notes ? `| ملاحظات قائد القطار: ${row.notes}` : ''}`;
  }

  // Column G represents 'ملاحظات قائد القطار'
  const driverNotesVal = row.driverNotes || (row.logType === 'تدوين ملاحظة عامة' ? row.notes : '');

  const values = [
    [
      row.trainId,
      row.driverId,
      datePart,
      timePart,
      row.location || '-',
      notesPart,
      driverNotesVal
    ]
  ];

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: range,
          majorDimension: 'ROWS',
          values: values
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Failed to append row to Google Sheet:', errText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error appending log to spreadsheet:', error);
    return false;
  }
};

// Fetch general and current notes from a dedicated sheet tab named 'ملاحظات الوردية'
export const fetchNotesFromSpreadsheet = async (
  spreadsheetId: string,
  token: string
): Promise<{ generalNotes: string; currentNotes: string; importantInstructions: string[] } | null> => {
  const sheetTitle = 'ملاحظات الوردية';
  try {
    // Ensure the sheet exists first
    const isReady = await ensureSheetExists(spreadsheetId, token, sheetTitle);
    if (!isReady) return null;

    const range = `${sheetTitle}!A1:C100`;
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch notes from sheet:', await response.text());
      return null;
    }

    const data = await response.json();
    const values = data.values || [];

    let generalNotes = '';
    let currentNotes = '';
    const importantInstructions: string[] = [];

    if (values && values.length > 0) {
      const firstCell = values[0]?.[0] || '';
      const isJson = firstCell.trim().startsWith('[') || firstCell.trim().startsWith('{');

      if (isJson) {
        generalNotes = firstCell;
        currentNotes = values[0]?.[1] || '';
      } else {
        // It is plain text. Let's gather all non-empty values from Column A
        const generalNotesList: string[] = [];
        for (let i = 0; i < values.length; i++) {
          const val = values[i]?.[0];
          if (val && val.trim()) {
            const trimmed = val.trim();
            // Skip general header if it's just a header
            if (i === 0 && (trimmed === 'ملاحظات عامة' || trimmed === 'General Notes' || trimmed === 'ملاحظات الوردية' || trimmed.includes('JSON'))) {
              continue;
            }
            generalNotesList.push(trimmed);
          }
        }
        generalNotes = generalNotesList.join('\n');

        // Gather all non-empty values from Column B
        const currentNotesList: string[] = [];
        for (let i = 0; i < values.length; i++) {
          const val = values[i]?.[1];
          if (val && val.trim()) {
            const trimmed = val.trim();
            if (i === 0 && (trimmed === 'ملاحظات حالية' || trimmed === 'Current Notes')) {
              continue;
            }
            currentNotesList.push(trimmed);
          }
        }
        currentNotes = currentNotesList.join('\n');
      }

      // Parse Column C starting from row 1 to 100
      for (let i = 0; i < values.length; i++) {
        const cellValue = values[i]?.[2];
        if (cellValue && cellValue.trim()) {
          const trimmed = cellValue.trim();
          // Skip row 0 if it acts as a header description
          if (i === 0 && (trimmed.includes('تعليمات') || trimmed.includes('ملاحظات') || trimmed === 'Instructions')) {
            continue;
          }
          importantInstructions.push(trimmed);
        }
      }
    }

    // Auto-populate C1 with a guiding header if Column C is completely empty
    if (!values || !values[0] || !values[0][2] || !values[0][2].trim()) {
      try {
        const headerRange = `${sheetTitle}!C1`;
        await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(headerRange)}?valueInputOption=USER_ENTERED`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              range: headerRange,
              majorDimension: 'ROWS',
              values: [['تعليمات ضرورية من الإدارة (اكتب أدناه للتزامن مع التطبيق)']]
            })
          }
        );
      } catch (e) {
        console.error('Failed to pre-populate Column C header:', e);
      }
    }

    return {
      generalNotes,
      currentNotes,
      importantInstructions
    };
  } catch (err) {
    console.error('Error in fetchNotesFromSpreadsheet:', err);
    return null;
  }
};

// Save general and current notes to a dedicated sheet tab named 'ملاحظات الوردية'
export const saveNotesToSpreadsheet = async (
  spreadsheetId: string,
  token: string,
  generalNotes: string,
  currentNotes: string
): Promise<boolean> => {
  const sheetTitle = 'ملاحظات الوردية';
  try {
    const isReady = await ensureSheetExists(spreadsheetId, token, sheetTitle);
    if (!isReady) return false;

    const range = `${sheetTitle}!A1:B1`;
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          range: range,
          majorDimension: 'ROWS',
          values: [[generalNotes, currentNotes]]
        })
      }
    );

    if (!response.ok) {
      console.error('Failed to save notes to sheet:', await response.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error saving notes to spreadsheet:', err);
    return false;
  }
};

// Update the note inside the driver's existing registration (الاستلام) row instead of creating a new row
export const updateLastRegistrationNoteInSpreadsheet = async (
  spreadsheetId: string,
  token: string,
  driverId: string,
  trainId: string,
  noteText: string
): Promise<boolean> => {
  const trainNum = trainId ? trainId.trim() : 'عام';
  const sheetTitle = `القطار رقم ${trainNum}`;

  try {
    const isReady = await ensureSheetExists(spreadsheetId, token, sheetTitle);
    const activeSheetTitle = isReady ? sheetTitle : 'سجل التشغيل والأعطال';

    // Fetch first 500 rows of column A to G to locate the driver's latest registration row
    const range = `${activeSheetTitle}!A1:G500`;
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch rows for updating notes:', await response.text());
      return false;
    }

    const data = await response.json();
    const values = data.values || [];

    // Find the last row where Column B (Driver ID, index 1) matches driverId, and Column F (Notes, index 5) contains 'تسجيل وردية جديدة'
    let targetRowIndex = -1;
    for (let i = values.length - 1; i >= 0; i--) {
      const row = values[i];
      if (!row) continue;
      
      const colB = row[1] ? String(row[1]).trim() : '';
      const colF = row[5] ? String(row[5]).trim() : '';
      
      if (colB === driverId.trim() && (colF.includes('تسجيل وردية جديدة') || colF.includes('تسجيل دخول') || colF.includes('استلام الوردية'))) {
        targetRowIndex = i;
        break;
      }
    }

    // Fallback: If no registration row found, search for the last row containing this driver's ID
    if (targetRowIndex === -1) {
      for (let i = values.length - 1; i >= 0; i--) {
        const row = values[i];
        if (!row) continue;
        const colB = row[1] ? String(row[1]).trim() : '';
        if (colB === driverId.trim()) {
          targetRowIndex = i;
          break;
        }
      }
    }

    // Determine 1-based row number
    let rowNumToUpdate = targetRowIndex !== -1 ? targetRowIndex + 1 : values.length + 1;
    if (rowNumToUpdate <= 1) {
      rowNumToUpdate = 2; // Avoid overwriting header
    }

    // Get existing driver notes in Column G (index 6) to append if any exists
    let existingDriverNote = '';
    if (targetRowIndex !== -1 && values[targetRowIndex] && values[targetRowIndex][6]) {
      existingDriverNote = String(values[targetRowIndex][6]).trim();
    }

    // Concatenate existing note with new note
    const finalNoteText = existingDriverNote 
      ? `${existingDriverNote} | ${noteText}` 
      : noteText;

    const updateRange = `${activeSheetTitle}!G${rowNumToUpdate}`;
    const updateResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(updateRange)}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          range: updateRange,
          majorDimension: 'ROWS',
          values: [[finalNoteText]]
        })
      }
    );

    if (!updateResponse.ok) {
      console.error('Failed to update note in Google Sheet:', await updateResponse.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in updateLastRegistrationNoteInSpreadsheet:', err);
    return false;
  }
};

