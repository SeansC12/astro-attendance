import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function POST(req) {
  const body = await req.json();
  try {
    const serviceAccountAuth = new JWT({
      email:
        "next-js-backend@astro-attendance.iam.gserviceaccount.com",
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

    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["Term 4"];
    const rows = await sheet.getRows();
    for (const row of rows.slice(1)) {
      if (row._rawData.includes(body.email)) {
        row.set(body.date, "1");
        await row.save();
      }
    }
    return NextResponse.json(
      { message: "Valid Attendance" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: `${err.response.data.error_description}. Please try again`,
      },
      { status: 200 }
    );
  }
}
