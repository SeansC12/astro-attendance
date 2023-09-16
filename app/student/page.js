"use client";

import React, { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

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
  const [open, setOpen] = useState("");
  const [qrResult, setQrResult] = useState("");
  const supabase = createClientComponentClient();

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center">
      <div className="w-[80%] aspect-square">
        <QrScanner
          onDecode={(result) => setQrResult(result)}
        />
        <div>{text}</div>
        <Link href="/student/absentee-form">
          <p>Absentee Form</p>
        </Link>
      </div>
      <button onClick={() => setOpen((curr) => !curr)}>
        open
      </button>
      <AlertDialogDemo
        open={open}
        setOpen={setOpen}
        callback={fake_scanned}
        result={qrResult}
      />
    </div>
  );
}

function AlertDialogDemo({
  open,
  setOpen,
  callback,
  result,
}) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {/* <Button variant="outline">Show Dialog</Button> */}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Would you like to log your attendance?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Please do not leave this page until a Success
            page has been shown. Attendance may not be
            logged should you leave the page prematurely.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => callback(result)}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default page;
