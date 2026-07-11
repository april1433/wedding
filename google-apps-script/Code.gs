/**
 * WEDDING SITE BACKEND — with JSONP support
 * -----------------------------------------------------
 * Paste this entire file into Extensions > Apps Script
 * in your Google Sheet, then:
 *   1. Click "Deploy" > "New deployment"
 *   2. Type: Web App
 *   3. Execute as: Me
 *   4. Who has access: Anyone
 *   5. Click Deploy, copy the URL into config.js
 *
 * If you already deployed, go to Deploy > Manage Deployments
 * and create a NEW deployment (don't just save).
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheetName = data.sheet || "RSVP";
    const sheet = getOrCreateSheet(sheetName);

    if (sheetName === "RSVP") {
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.name      || "",
        data.attending || "",
        data.guests    || "",
        data.contact   || "",
        data.message   || ""
      ]);
    } else if (sheetName === "Guestbook") {
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.name      || "",
        data.message   || ""
      ]);
    }

    return buildResponse(e, { status: "ok" });
  } catch(err) {
    return buildResponse(e, { status: "error", message: err.message });
  }
}

function doGet(e) {
  try {
    const type  = (e.parameter.type || "RSVP");
    const sheet = getOrCreateSheet(type);
    const values = sheet.getDataRange().getValues();

    let rows = [];
    if (type === "RSVP") {
      rows = values.map(r => ({
        timestamp: r[0], name: r[1], attending: r[2],
        guests: r[3], contact: r[4], message: r[5]
      }));
    } else if (type === "Guestbook") {
      rows = values.map(r => ({
        timestamp: r[0], name: r[1], message: r[2]
      }));
    }

    return buildResponse(e, { rows: rows });
  } catch(err) {
    return buildResponse(e, { status: "error", message: err.message });
  }
}

/**
 * Builds a response that supports BOTH:
 *   - Normal JSON   (when no callback param)
 *   - JSONP         (when ?callback=functionName is present)
 * JSONP bypasses browser CORS restrictions completely.
 */
function buildResponse(e, obj) {
  const json     = JSON.stringify(obj);
  const callback = e && e.parameter && e.parameter.callback;

  if (callback) {
    // JSONP: wrap in the callback function call
    const output = ContentService.createTextOutput(callback + "(" + json + ");");
    output.setMimeType(ContentService.MimeType.JAVASCRIPT);
    return output;
  } else {
    // Plain JSON
    const output = ContentService.createTextOutput(json);
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  }
}

function getOrCreateSheet(name) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let sheet   = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === "RSVP") {
      sheet.appendRow(["Timestamp","Name","Attending","Guests","Contact","Message"]);
    } else if (name === "Guestbook") {
      sheet.appendRow(["Timestamp","Name","Message"]);
    }
  }
  return sheet;
}
