import { NextResponse } from "next/server";
import eventBus from "@/utils/EventBus";

export async function POST() {
  console.log(eventBus);
  eventBus.publish("onAttendanceLogged", "test", false);
  return NextResponse.json(
    { message: "Valid Attendance" },
    { status: 200 }
  );
}
