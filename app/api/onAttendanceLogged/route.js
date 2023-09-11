import EventBus from "@/utils/EventBus";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
// This is required to enable streaming
export const dynamic = "force-dynamic";

const eb = new EventBus();

export async function GET(req) {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();
  console.log(eb);

  try {
    eb.subscribe("onAttendanceLogged", (email, pass) => {
      console.log("received");
      writer.write(encoder.encode(`${email},${pass}\n\n`));
    });
  } catch (err) {
    console.error(err);
    writer.write(encoder.encode("An error has occurred."));
    writer.close();
  }
  console.log(eb);

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Content-Encoding": "none",
    },
  });
}

export async function POST(req) {
  eb.publish("onAttendanceLogged", "test", false);
  return NextResponse.json(
    { message: "Valid Attendance" },
    { status: 200 }
  );
}
