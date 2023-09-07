"use client";

import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";

function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const supabase = createClientComponentClient();
  const router = useRouter();

  async function login(email, password) {
    const data = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    router.push("/");
  }

  return (
    <div>
      <form
        onSubmit={() => login(email, password)}
        method="post"
      >
        <label htmlFor="email">Email</label>
        <TextField
          id="outlined-basic"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <TextField
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default page;
