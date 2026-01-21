
/**
 * BACKEND API - SISTEM SUPERVISI AKADEMIK DIGITAL
 * UPT SMPN 4 MAPPEDECENG
 * ID Spreadsheet: 1bkZ4PYM_7LaPDv00dKfqKZdb8vGbZrOrCb3gLVPMQ-s
 */

const SPREADSHEET_ID = '1bkZ4PYM_7LaPDv00dKfqKZdb8vGbZrOrCb3gLVPMQ-s';

/**
 * Endpoint untuk menerima permintaan data (GET)
 */
function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getObservations') {
    const data = getObservationsFromCloud();
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Default: Return status
  return ContentService.createTextOutput(JSON.stringify({status: 'API Active'}))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Endpoint untuk menerima penyimpanan data (POST)
 */
function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const result = saveObservationToCloud(postData);
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getObservationsFromCloud() {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('Observasi') || createSheetStructure(ss);
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    
    const headers = data[0];
    return data.slice(1).map(row => {
      const obs = {};
      headers.forEach((header, index) => {
        if (header === 'indicators') {
          try {
            obs[header] = JSON.parse(row[index] || '{}');
          } catch(e) { obs[header] = {}; }
        } else {
          obs[header] = row[index];
        }
      });
      return obs;
    });
  } catch (e) {
    return [];
  }
}

function saveObservationToCloud(obsData) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('Observasi') || createSheetStructure(ss);
    const data = sheet.getDataRange().getValues();
    const teacherId = obsData.teacherId;
    
    const rowIndex = data.findIndex(row => row[0] == teacherId);
    const rowData = [
      obsData.teacherId,
      obsData.date,
      obsData.subject,
      obsData.conversationTime,
      obsData.learningGoals,
      obsData.focusId,
      JSON.stringify(obsData.indicators),
      obsData.reflection,
      obsData.coachingFeedback,
      obsData.rtl,
      obsData.status
    ];

    if (rowIndex > -1) {
      sheet.getRange(rowIndex + 1, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function createSheetStructure(ss) {
  let sheet = ss.getSheetByName('Observasi');
  if (!sheet) {
    sheet = ss.insertSheet('Observasi');
    const headers = ['teacherId', 'date', 'subject', 'conversationTime', 'learningGoals', 'focusId', 'indicators', 'reflection', 'coachingFeedback', 'rtl', 'status'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#f3f4f6');
    sheet.setFrozenRows(1);
  }
  return sheet;
}
