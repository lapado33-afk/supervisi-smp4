
/**
 * BACKEND API - SISTEM SUPERVISI AKADEMIK DIGITAL
 * UPT SMPN 4 MAPPEDECENG
 */

// ID Spreadsheet target integrasi
const SPREADSHEET_ID = '1cZHgmvzlXcjZCccbB3MnA97zwZZclLRFAotSDMs1q2w';

function doGet(e) {
  const action = e.parameter.action;
  if (action === 'getObservations') {
    return createJsonResponse(getObservationsFromCloud());
  }
  return createJsonResponse({status: 'API Active', spreadsheetId: SPREADSHEET_ID});
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const result = saveObservationToCloud(postData);
    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({success: false, error: err.toString()});
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
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
          try { obs[header] = JSON.parse(row[index] || '{}'); } catch(e) { obs[header] = {}; }
        } else { obs[header] = row[index]; }
      });
      return obs;
    });
  } catch (e) { return []; }
}

function saveObservationToCloud(obsData) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('Observasi') || createSheetStructure(ss);
    const data = sheet.getDataRange().getValues();
    const teacherId = obsData.teacherId;
    
    // Cari baris jika sudah ada (berdasarkan ID Guru)
    const rowIndex = data.findIndex(row => row[0] == teacherId);
    
    // Susunan kolom HARUS SAMA dengan createSheetStructure
    const rowData = [
      obsData.teacherId,
      obsData.teacherName || '',
      obsData.teacherNip || '',
      obsData.principalNip || '',
      obsData.date,
      obsData.subject,
      obsData.conversationTime,
      obsData.learningGoals || '',
      obsData.developmentArea || '',
      obsData.strategy || '',
      obsData.supervisorNotes || '',
      obsData.additionalNotes || '',
      obsData.focusId,
      JSON.stringify(obsData.indicators || {}),
      obsData.reflection || '',
      obsData.coachingFeedback || '',
      obsData.rtl || '',
      obsData.status
    ];

    if (rowIndex > -1) {
      sheet.getRange(rowIndex + 1, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
    return { success: true };
  } catch (e) { return { success: false, error: e.toString() }; }
}

function createSheetStructure(ss) {
  let sheet = ss.getSheetByName('Observasi');
  const headers = [
    'teacherId', 'teacherName', 'teacherNip', 'principalNip', 'date', 'subject', 'conversationTime', 
    'learningGoals', 'developmentArea', 'strategy', 'supervisorNotes', 'additionalNotes', 'focusId', 'indicators', 'reflection', 
    'coachingFeedback', 'rtl', 'status'
  ];

  if (!sheet) {
    sheet = ss.insertSheet('Observasi');
    sheet.getRange(1, 1, 1, headers.length)
         .setValues([headers])
         .setFontWeight('bold')
         .setBackground('#f3f4f6');
    sheet.setFrozenRows(1);
  } else {
    // Pastikan header diperbarui jika ada kolom baru
    const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (currentHeaders.length < headers.length) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
  }
  return sheet;
}
