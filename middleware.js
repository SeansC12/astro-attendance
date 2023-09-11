import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import eventBus from "./utils/EventBus";

export async function middleware(req) {
  if (
    req.nextUrl.pathname.startsWith("/api/logAttendance")
  ) {
    const secret = new TextEncoder().encode(
      process.env.NEXT_PUBLIC_JWT_SECRET
    );
    const body = await req.json();
    console.log(eventBus);
    NextResponse.next();
    // try {
    //   await jwtVerify(body.token, secret, {
    //     issuer: "urn:example:issuer",
    //     audience: "urn:example:audience",
    //   });
    //   eventBus.publish(
    //     "onAttendanceLogged",
    //     body.email,
    //     true
    //   );
    //   NextResponse.next();
    // } catch (err) {
    //   eventBus.publish(
    //     "onAttendanceLogged",
    //     body.email,
    //     false
    //   );
    //   return NextResponse.json(
    //     {
    //       message:
    //         "Unable to validate attendance. Please try again",
    //     },
    //     { status: 200 }
    //   );
    // }
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();
  return res;
}
