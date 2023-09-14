"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "react-qr-code";
import { SignJWT } from "jose";
import nebula from "@/public/nebula.jpeg";

function page() {
  const [token, setToken] = useState("");
  const [time, setTime] = useState(Date.now());
  const today = new Date();
  const day = String(today.getDate());
  const month = months[today.getMonth() + 1];
  const year = today.getFullYear();

  (async function getToken() {
    const iat = Math.floor(Date.now() / 5000);
    const secret = new TextEncoder().encode(
      process.env.NEXT_PUBLIC_JWT_SECRET
    );

    const token = await new SignJWT({
      "urn:example:claim": true,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("200h")
      .setIssuedAt(iat)
      .setIssuer("urn:example:issuer")
      .setAudience("urn:example:audience")
      .setNotBefore(iat)
      .sign(secret);

    setToken(token);
    console.log(token);
  })();

  useEffect(() => {
    const interval = setInterval(
      () => setTime(Date.now()),
      15000
    );
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <div className="absolute z-20 left-1/2 -translate-x-1/2 top-[22%] text-4xl font-bold text-white">
        {day} of {month} {year}
      </div>
      <div className="absolute z-20 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        <div className="bg-orange-500 p-3 rounded-md">
          <QRCode value={token} />
        </div>
      </div>
      <Image
        className="w-full h-full overflow-hidden grayscale-[10%] object-cover"
        loading="lazy"
        src={nebula}
      />
    </div>
  );
}

var months = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

export default page;
