"use client";

import React from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

function page() {
  const supabase = createClientComponentClient();

  async function login() {
    const data = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    console.log(data);
  }

  return (
    <div>
      <form>
        <button onClick={login}>Log In</button>
      </form>
    </div>
  );
}

export default page;
