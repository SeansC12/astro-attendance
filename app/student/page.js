"use client";

import React, { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

function page() {
  const [text, setText] = useState("");
  const supabase = createClientComponentClient();

  async function scanned(result) {
    const confirmed = window.confirm(
      "Would you like to log your attendance?"
    );
    if (!confirmed) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setText("Loading...");
    const res = await fetch("/api/onAttendanceLogged", {
      method: "POST",
      body: JSON.stringify({
        token: result,
        email: user.email,
      }),
    });
    const data = await res.json();

    if (res.status === 200) {
      setText(data.message);
      return;
    }

    setError("Something went wrong. Please try again");
  }

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center">
      <div className="w-[80%] aspect-square">
        <QrScanner onDecode={(result) => scanned(result)} />
        <div
          onClick={() =>
            scanned(
              "eyJhbGciOiJIUzI1NiJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZSwiZXhwIjozMzg4NTE4MTIsImlhdCI6MzM4ODQ4MjEyLCJpc3MiOiJ1cm46ZXhhbXBsZTppc3N1ZXIiLCJhdWQiOiJ1cm46ZXhhbXBsZTphdWRpZW5jZSIsIm5iZiI6MzM4ODQ4MjEyfQ.0qiQ-57kX1DTjiSKLCqK2iIw23LyDTgtvGofHNhPD7c"
            )
          }
        >
          hi
        </div>
        <div>{text}</div>
      </div>
    </div>
  );
}

export default page;
