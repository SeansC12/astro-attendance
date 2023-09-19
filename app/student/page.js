"use client";

import React, { useEffect, useState } from "react";
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
import { Terminal, Waves } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

function page() {
  const [text, setText] = useState("");
  const [confirmationOpen, setConfirmationOpen] =
    useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [qrResult, setQrResult] = useState("");
  const [
    hasLoggedAttendanceToday,
    setHasLoggedAttendanceToday,
  ] = useState(false);
  const supabase = createClientComponentClient();

  async function scanned(result) {
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
        token: result,
        email: user.email,
        date: `${dd}/${mm}/${yyyy}`,
      }),
    });
    const data = await res.json();

    setLoadingOpen(false);

    let attendanceStatus = JSON.parse(
      localStorage.getItem("attendanceStatus")
    );
    if (!attendanceStatus) {
      localStorage.setItem(
        "attendanceStatus",
        JSON.stringify([])
      );
      attendanceStatus = [];
    }

    const newAttendanceStatus = JSON.parse(
      JSON.stringify(attendanceStatus)
    );
    console.log(
      JSON.parse(localStorage.getItem("attendanceStatus"))
    );
    if (res.status === 200) {
      setSuccessOpen(true);
      setText(data.message);

      for (const day of newAttendanceStatus) {
        if (day.date === `${dd}/${mm}/${yyyy}`) {
          day.isAttendanceSuccessful = true;
          localStorage.setItem(
            "attendanceStatus",
            newAttendanceStatus
          );
          return;
        }
      }
      newAttendanceStatus.push({
        date: `${dd}/${mm}/${yyyy}`,
        hasLoggedAttendance: true,
      });
      localStorage.setItem(
        "attendanceStatus",
        JSON.stringify(newAttendanceStatus)
      );
      setHasLoggedAttendanceToday(true);
      return;
    } else if (res.status === 201) {
      setErrorOpen(true);
      setText(data.message);

      for (const day of newAttendanceStatus) {
        if (day.date === `${dd}/${mm}/${yyyy}`) {
          day.isAttendanceSuccessful = false;
          localStorage.setItem(
            "attendanceStatus",
            JSON.stringify(newAttendanceStatus)
          );
          return;
        }
      }
      newAttendanceStatus.push({
        date: `${dd}/${mm}/${yyyy}`,
        hasLoggedAttendance: false,
      });
      localStorage.setItem(
        "attendanceStatus",
        JSON.stringify(newAttendanceStatus)
      );
      return;
    }

    setText("Something went wrong. Please try again");
  }

  useEffect(() => {
    if (typeof window === undefined) return "";

    try {
      const attendanceLog = JSON.parse(
        localStorage.getItem("attendanceStatus")
      )[0].hasLoggedAttendance;

      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(
        2,
        "0"
      );
      const yyyy = today.getFullYear();

      for (element of attendanceLog) {
        if (element.date === `${dd}/${mm}/${yyyy}`) {
          if (!element.hasLoggedAttendance) return;
          setHasLoggedAttendanceToday(true);
        }
      }
    } catch (err) {
      return "";
    }
  }, []);

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
        </div>
        <button onClick={() => setConfirmationOpen(true)}>
          Test endpoint manually
        </button>
        {hasLoggedAttendanceToday ? (
          <HasTakenAttendanceAlert />
        ) : (
          <HasNotTakenAttendanceAlert />
        )}
        <ConfirmationDialog
          open={confirmationOpen}
          setOpen={setConfirmationOpen}
          callback={scanned}
          result={
            "eyJhbGciOiJIUzI1NiJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZSwiZXhwIjoxNjk1NDIwODQ2LCJpYXQiOjMzODk0MDE2OSwiaXNzIjoidXJuOmV4YW1wbGU6aXNzdWVyIiwiYXVkIjoidXJuOmV4YW1wbGU6YXVkaWVuY2UiLCJuYmYiOjMzODk0MDE2OX0.kDuCRiEY6fG2YsGhSPjTR20d2M1Hhn_C77DAkcawyPo"
          }
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

function HasTakenAttendanceAlert() {
  return (
    <Alert className="h-max w-full max-w-xl border-2 dark:border-green-700 dark:text-green-700">
      <Terminal className="h-4 w-4" />
      <AlertTitle className="text-xl">
        You have already logged your attendance for today!
      </AlertTitle>
      <AlertDescription className="text-base">
        A valid attendance has been recorded for today.
      </AlertDescription>
    </Alert>
  );
}

function HasNotTakenAttendanceAlert() {
  return (
    <Alert className="h-max w-full max-w-xl border-2 dark:border-red-500 dark:text-red-500">
      <Terminal className="h-4 w-4" />
      <AlertTitle className="text-xl">Heads up!</AlertTitle>
      <AlertDescription>
        No valid attendance was recorded today.
      </AlertDescription>
    </Alert>
  );
}

export default page;
