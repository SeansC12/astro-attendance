import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function POST(req) {
  const body = await req.json();
  try {
    const serviceAccountAuth = new JWT({
      email: "sean.ulric.chua@gmail.com",
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.split(
        String.raw`\n`
      ).join("\n"),
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const doc = new GoogleSpreadsheet(
      process.env.SPREADSHEET_ID,
      serviceAccountAuth
    );

    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title);

    return NextResponse.json(
      { message: "Valid Attendance" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: `${err.response.data.error_description}. Please try again`,
      },
      { status: 200 }
    );
  }
}
