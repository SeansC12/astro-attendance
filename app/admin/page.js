import React from "react";
import QRCode from "react-qr-code";
import { SignJWT } from "jose";

export const revalidate = 1;

async function getToken() {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 + 60; // one second
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET
  );

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(secret);

  return token;
}

async function page() {
  const token = await getToken();
  console.log("test");

  return (
    <div className="p-5">
      <QRCode value={token} />
    </div>
  );
}

export default page;
