"use client";

import React, { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

function page() {
  async function scanned(result) {
    const confirmed = window.confirm(
      "Would you like to log your attendance?"
    );
    if (!confirmed) return;

    setText("Loading...");
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(
      2,
      "0"
    );
    const yyyy = today.getFullYear();

    const res = await fetch("/api/logAttendance", {
      method: "POST",
      body: JSON.stringify({
        token: result,
        email: user.email,
        date: `${dd}/${mm}/${yyyy}`,
      }),
    });
    const data = await res.json();

    if (res.status === 200) {
      setText(data.message);
      return;
    }

    setError("Something went wrong. Please try again");
  }

  async function fake_scanned(result) {
    const confirmed = window.confirm(
      "Would you like to log your attendance?"
    );
    if (!confirmed) return;

    setText("Loading...");
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(
      2,
      "0"
    );
    const yyyy = today.getFullYear();

    const res = await fetch("/api/logAttendance", {
      method: "POST",
      body: JSON.stringify({
        token:
          "eyJhbGciOiJIUzI1NiJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZSwiZXhwIjoxNjk1NDIwODQ2LCJpYXQiOjMzODk0MDE2OSwiaXNzIjoidXJuOmV4YW1wbGU6aXNzdWVyIiwiYXVkIjoidXJuOmV4YW1wbGU6YXVkaWVuY2UiLCJuYmYiOjMzODk0MDE2OX0.kDuCRiEY6fG2YsGhSPjTR20d2M1Hhn_C77DAkcawyPo",
        email: user.email,
        date: `${dd}/${mm}/${yyyy}`,
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
  const supabase = createClientComponentClient();

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center">
      <div className="w-[80%] aspect-square">
        <QrScanner onDecode={(result) => scanned(result)} />
        <div>{text}</div>
        <Link href="/student/absentee-form">
          <p>Absentee Form</p>
        </Link>
      </div>
      <button onClick={fake_scanned}>test</button>
    </div>
  );
}

export default page;
