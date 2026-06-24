import { NextResponse } from "next/server";
import { google } from "googleapis";

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
      console.log("[Mock API] Labour Received:", body);
      return NextResponse.json({ success: true, message: "Mock saved" });
    }

    const sheets = google.sheets({ version: "v4", auth });

    // Prepare rows for each labour type
    const timestamp = new Date().toISOString();
    const values = body.labour.map((lab: { type: string; count: number; contractor: string; remarks: string }) => [
      body.date,
      lab.type,
      lab.count,
      lab.contractor,
      lab.remarks,
      timestamp
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Labour!A:F",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Labour API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save labour count" },
      { status: 500 }
    );
  }
}
