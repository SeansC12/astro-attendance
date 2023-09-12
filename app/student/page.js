"use client";

import React, { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import Link from "next/link";

function page() {
  async function scanned(result) {
    const confirmed = window.confirm(
      "Would you like to log your attendance?"
    );
    if (!confirmed) return;

    setText("Loading...");
    const res = await fetch("/api/logAttendance", {
      method: "POST",
      body: JSON.stringify({
        token: result,
      }),
    });
    const data = await res.json();

    if (res.status === 200) {
      setText(data.message);
      return;
    }

    setError("Something went wrong. Please try again");
  }

  const [text, setText] = useState("");

  return (
    <div className="w-[40%] aspect-square m-auto">
      <QrScanner onDecode={(result) => scanned(result)} />
      <Link href= "/student/absenteeForm"><p>cum</p></Link>
    </div>
  );
}

export default page;
