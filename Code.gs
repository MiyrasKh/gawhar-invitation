const SHEET_NAME = 'Ushırasıw kelisimi';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Jiberilgen waqıt', 'Qonaq', 'Usınıs etken', 'Restoran/jer', 'Sáne', 'Waqıt', 'Kelisim']);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([
      new Date(),
      data.guestName || '',
      data.hostName || '',
      data.restaurant || '',
      data.date || '',
      data.time || '',
      data.agreement || ''
    ]);
    return ContentService.createTextOutput(JSON.stringify({ok:true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
