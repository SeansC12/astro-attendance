"use client";

import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { SignJWT } from "jose";

function page() {
  const [token, setToken] = useState("");
  const [time, setTime] = useState(Date.now());

  (async function getToken() {
    const iat = Math.floor(Date.now() / 5000);
    const exp = iat + 15;
    const secret = new TextEncoder().encode(
      process.env.NEXT_PUBLIC_JWT_SECRET
    );

    const token = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(exp)
      .setIssuedAt(iat)
      .setNotBefore(iat)
      .sign(secret);

    setToken(token);
  })();

  useEffect(() => {
    const interval = setInterval(
      () => setTime(Date.now()),
      5000
    );
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="p-5">
      <QRCode value={token} />
    </div>
  );
}

export default page;
