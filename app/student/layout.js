"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import MenuBarItem from "@/components/MenuBarItem";

function layout({ children }) {
  const [selectedPageIndex, setSelectedPageIndex] =
    useState(0);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    if (String(window.location).endsWith("qr")) {
      setSelectedPageIndex(0);
    } else if (
      String(window.location).endsWith("absence")
    ) {
      setSelectedPageIndex(1);
    }
  }, []);

  return (
    <div className="w-full h-[100vh] bg-black overflow-y-hidden">
      <div className="w-full text-white flex items-center justify-center py-[15px]">
        <div className="flex gap-9 items-center justify-center">
          <MenuBarItem
            state={selectedPageIndex}
            setter={setSelectedPageIndex}
            href="/student"
            text={"QR"}
            order={0}
          />
          <MenuBarItem
            state={selectedPageIndex}
            setter={setSelectedPageIndex}
            href="/student/absentee-form"
            text={"Absence"}
            order={1}
          />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="border-b-[1px] border-b-slate-600 h-[1px] w-full" />
      </div>
      <div className="w-full h-[92%]">{children}</div>
    </div>
  );
}

export default layout;
