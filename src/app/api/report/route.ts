import { NextResponse } from "next/server";
import { google } from "googleapis";

// Ensure environment variables are structured correctly if provided
const getGoogleAuth = () => {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    return null;
  }

  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const auth = getGoogleAuth();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!auth || !spreadsheetId) {
      // Fallback: If credentials aren't set, log it and return success for testing
      console.log("[Mock API] Daily Report Received:", body);
      return NextResponse.json({ success: true, message: "Mock saved (No Google Sheets credentials provided)" });
    }

    const sheets = google.sheets({ version: "v4", auth });

    // Flatten data for the spreadsheet
    const values = [
      [
        body.date,
        body.project,
        body.weather,
        body.workAccomplished,
        body.materials,
        body.issues,
        new Date().toISOString() // Timestamp
      ]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Reports!A:G", // Make sure this tab exists in the client's sheet
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Report API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save report" },
      { status: 500 }
    );
  }
}
