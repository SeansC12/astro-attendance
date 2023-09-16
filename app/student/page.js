"use client";

import React, { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
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

function page() {
  const [text, setText] = useState("");
  const [confirmationOpen, setConfirmationOpen] =
    useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [qrResult, setQrResult] = useState("");
  const supabase = createClientComponentClient();

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
    setText("Loading...");
    setConfirmationOpen(false);
    setLoadingOpen(true);
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

    setLoadingOpen(false);
    console.log(res.status, data.message);
    if (res.status === 200) {
      setSuccessOpen(true);
      setText(data.message);
      return;
    } else if (res.status === 201) {
      setErrorOpen(true);
      setText(data.message);
      return;
    }

    setText("Something went wrong. Please try again");
  }

  return (
    <div className="w-full h-full">
      <div className="absolute text-xl font-bold text-white text-center w-full top-36 px-3">
        Welcome, scan your attendance here.
      </div>
      <div className="w-full h-full flex items-center justify-center flex-col bg-black text-white">
        <div className="w-[80%] max-w-xl h-max aspect-square p-2 border-2 border-indigo-400 rounded-md">
          <QrScanner
            onDecode={(result) => {
              setQrResult(result);
              setConfirmationOpen(true);
            }}
            viewFinderBorder={10}
          />
          <div>{text}</div>
        </div>
        <button onClick={() => setConfirmationOpen(true)}>
          Test endpoint manually
        </button>
        <ConfirmationDialog
          open={confirmationOpen}
          setOpen={setConfirmationOpen}
          callback={fake_scanned}
          result={qrResult}
        />
        <LoadingDialog
          open={loadingOpen}
          setOpen={setLoadingOpen}
        />
        <SuccessDialog
          open={successOpen}
          setOpen={setSuccessOpen}
        />
        <ErrorDialog
          open={errorOpen}
          setOpen={setErrorOpen}
          description={text}
        />
      </div>
    </div>
  );
}

function ConfirmationDialog({
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

function LoadingDialog({ open, setOpen }) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {/* <Button variant="outline">Show Dialog</Button> */}
      </AlertDialogTrigger>
      <AlertDialogContent className="dark:bg-yellow-300">
        <AlertDialogHeader className="">
          <AlertDialogTitle className="text-black">
            Your attendance is being logged. Please wait.
          </AlertDialogTitle>
          <AlertDialogDescription className="dark:text-slate-600">
            Please do not leave this page until a Success
            page has been shown. Attendance may not be
            logged should you leave the page prematurely.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* <AlertDialogFooter>
          <AlertDialogCancel className="text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => callback(result)}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter> */}
      </AlertDialogContent>
    </AlertDialog>
  );
}

function SuccessDialog({ open, setOpen }) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {/* <Button variant="outline">Show Dialog</Button> */}
      </AlertDialogTrigger>
      <AlertDialogContent className="dark:bg-green-500">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black">
            Your attendance has been confirmed.
          </AlertDialogTitle>
          <AlertDialogDescription className="dark:text-slate-900">
            You may now leave this page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ErrorDialog({ open, setOpen, description }) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {/* <Button variant="outline">Show Dialog</Button> */}
      </AlertDialogTrigger>
      <AlertDialogContent className="dark:bg-red-400">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black">
            Oh, no. Something went wrong. Please try again.
          </AlertDialogTitle>
          <AlertDialogDescription className="dark:text-slate-900">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default page;
