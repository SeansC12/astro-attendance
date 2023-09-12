import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req) {
  const body = await req.json();
  try {
    const target = [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
    ];
    const jwt = new google.auth.JWT(
      body.email,
      null,
      process.env.GOOGLE_SHEETS_PRIVATE_KEY || "",
      target
    );
    const sheets = google.sheets({
      version: "v4",
      auth: jwt,
    });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Term 4", // sheet name
    });
    const rows = response.data.values;
    console.log(rows);
    console.log("hi");
    return NextResponse.json(
      { message: "Valid Attendance" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message:
          "Something went wrong in logging your attendance. Please try again.",
      },
      { status: 200 }
    );
  }
}
