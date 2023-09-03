"use client";

import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [error, setError] = useState("");
  const supabase = createClientComponentClient();
  const router = useRouter();

  async function signUp(email, password, confirmPassword) {
    if (password !== confirmPassword) {
      setError(
        "Password and confirm password are unequal."
      );
      router.refresh();
      return;
    }

    const data = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (data.error) {
      setError(data.error);
      console.log(data.error);
    }

    router.refresh();
  }
  return (
    <div>
      <form
        onSubmit={() =>
          signUp(email, password, confirmPassword)
        }
        method="post"
      >
        <label htmlFor="email">Email</label>
        <TextField
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <TextField
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="password">Confirm password</label>
        <TextField
          type="password"
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
        />
        <button type="submit">Sign Up</button>
      </form>
      {/* <div>{error}</div> */}
    </div>
  );
}

export default page;
