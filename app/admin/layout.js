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
    if (String(window.location).endsWith("sheets")) {
      setSelectedPageIndex(0);
    } else if (String(window.location).endsWith("qr")) {
      setSelectedPageIndex(1);
    } else if (
      String(window.location).endsWith("absence")
    ) {
      setSelectedPageIndex(2);
    }
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const emailDomain = user.email.split("@");
      if (
        emailDomain !== "sst.edu.sg" &&
        user.email !== "sean.ulric.chua@gmail.com"
      ) {
        router.push("/login");
      }
      console.log(user);
    }
    getUser();
  }, []);

  return (
    <div className="w-full h-[100vh] bg-black overflow-y-hidden">
      <div className="w-full h-[8%] text-white flex items-center justify-start gap-8 pl-20">
        <MenuBarItem
          state={selectedPageIndex}
          setter={setSelectedPageIndex}
          href="/admin/sheets"
          text={"Sheets"}
          order={0}
        />
        <MenuBarItem
          state={selectedPageIndex}
          setter={setSelectedPageIndex}
          href="/admin/qr"
          text={"QR"}
          order={1}
        />
        <MenuBarItem
          state={selectedPageIndex}
          setter={setSelectedPageIndex}
          href="/admin/absence"
          text={"Absence"}
          order={2}
        />
      </div>
      <div className="flex items-center justify-center">
        <div className="border-b-[1px] border-b-slate-600 h-[1px] w-full " />
      </div>
      <div className="w-full h-[92%]">{children}</div>
    </div>
  );
}

export default layout;
