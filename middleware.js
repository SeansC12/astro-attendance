import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  if (
    req.nextUrl.pathname.startsWith("/api/logAttendance")
  ) {
    const secret = new TextEncoder().encode(
      process.env.NEXT_PUBLIC_JWT_SECRET
    );
    const body = await req.json();

    try {
      await jwtVerify(body.token, secret, {
        issuer: "urn:example:issuer",
        audience: "urn:example:audience",
      });
      NextResponse.next();
    } catch (err) {
      return NextResponse.json(
        {
          message:
            "Unable to validate attendance. Please try again",
        },
        { status: 200 }
      );
    }
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();
  return res;
}
