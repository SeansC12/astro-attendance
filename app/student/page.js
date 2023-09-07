"use client";

import React, { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";

function page() {
  async function scanned(result) {
    const confirmed = window.confirm(
      "Would you like to log your attendance?"
    );
    if (!confirmed) return;

    const res = await fetch("/api/logAttendance", {
      method: "POST",
      body: JSON.stringify({
        token: result,
      }),
    });
    console.log(res);
    const data = await res.json();

    if (res.status === 200) {
      setError(data.message);
      return;
    }

    setError("Something went wrong. Please try again");
  }

  const [error, setError] = useState("");

  return (
    <div className="w-[40%] aspect-square">
      <QrScanner onDecode={(result) => scanned(result)} />
      <div>{error}</div>
    </div>
  );
}

export default page;
