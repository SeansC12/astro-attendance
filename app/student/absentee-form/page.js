"use client";

import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import icon from "@/public/loadingIcon.svg";
import Image from "next/image";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
// import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function absenteeForm() {
  const supabase = createClientComponentClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    const res = await supabase
      .from("AbsenceRequests")
      .insert({
        name: name,
        email: email,
        reason: reason,
        absentDate: date,
      });
    console.log(res.error);
    if (res.error) {
      console.log(res.error.message);
      setError("Error: " + res.error.message);
    } else {
      setName("");
      setDate("");
      setReason("");
      setSubmitted(true);
    }
  }

  async function writeEmailToState() {
    const { data } = await supabase.auth.getUser();
    setEmail(data.user.email);
    return data.user.email;
  }
  useEffect(() => {
    writeEmailToState();
  }, []);

  return (
    <div className="px-5 text-white">
      <div className="w-full flex items-center flex-col gap-7">
        <div className="grid w-full max-w-sm items-center gap-1.5 text-white font-lato mt-5">
          <Label className="text-base">Name</Label>
          <Input
            className="text-base"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid w-full text-base max-w-sm items-center gap-1.5 text-white font-lato">
          <Label className="text-base">
            Date of Absence
          </Label>
          <Popover className="w-full">
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-lato dark:text-white",
                  !date && "text-muted-foreground"
                )}
              >
                {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
                {date ? (
                  format(date, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 text-white font-lato">
          <Label className="text-base">Reason</Label>
          <Input
            className="text-base"
            placeholder="Reason"
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <p>{error}</p>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={
            name == "" ||
            email == "" ||
            date == "" ||
            reason == ""
          }
        >
          Submit
        </Button>
      </div>
      {submitted ? (
        <div>
          <p>Successfully submitted request</p>
          <Link href="/">Back to home</Link>
        </div>
      ) : null}
    </div>
  );
}

const animatedLoading = (
  <div className="animate-spin m-1 w-fit h-fit">
    <Image
      className="w-5 h-5"
      src={icon}
      alt="Loading..."
    ></Image>
  </div>
);
