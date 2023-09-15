import React from "react";
import Link from "next/link";

function MenuBarItem({ state, setter, href, text, order }) {
  return (
    <Link
      className={`${
        state === order
          ? "text-indigo-400"
          : "text-[#818182]"
      } hover:text-indigo-400 transition-all ease-in-out text-lg`}
      onClick={() => setter(order)}
      href={href}
    >
      {text}
    </Link>
  );
}

export default MenuBarItem;
