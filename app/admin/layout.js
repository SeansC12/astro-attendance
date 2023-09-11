"use client";

import React, { useState } from "react";
import Link from "next/link";

function layout({ children }) {
  const [selectedPageIndex, setSelectedPageIndex] =
    useState(0);
  return (
    <div className="w-full h-[100vh]">
      <div className="w-full h-[10%] bg-slate-400 text-white flex items-center justify-evenly">
        <Link
          className={`${
            selectedPageIndex === 0 ? "underline" : ""
          }`}
          onClick={() => setSelectedPageIndex(0)}
          href="/admin/sheets"
        >
          Sheets
        </Link>
        <Link
          className={`${
            selectedPageIndex === 1 ? "underline" : ""
          }`}
          onClick={() => setSelectedPageIndex(1)}
          href="/admin/qr"
        >
          QR
        </Link>
        <Link
          className={`${
            selectedPageIndex === 2 ? "underline" : ""
          }`}
          onClick={() => setSelectedPageIndex(2)}
          href="/admin/absence"
        >
          Absence
        </Link>
      </div>
      <div className="w-full h-[90%]">{children}</div>
    </div>
  );
}

export default layout;
