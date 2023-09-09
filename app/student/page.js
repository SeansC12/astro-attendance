"use client";

import React, { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";

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
    <div className="w-[100vw] h-[100vh] flex items-center justify-center">
      <div className="w-[80%] aspect-square">
        <QrScanner onDecode={(result) => scanned(result)} />
        <div>{text}</div>
      </div>
    </div>
  );
}

export default page;
