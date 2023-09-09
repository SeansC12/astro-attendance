import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

async function redirectToRelevantPage(supabase, redirect) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
    return;
  }
  const emailDomain = user.email.split("@")[1];
  if (
    emailDomain === "sst.edu.sg" ||
    user.email === "sean.ulric.chua@gmail.com"
  ) {
    redirect("/admin");
    return;
  }
  redirect("/student");
}

export default async function Home() {
  const supabase = createServerComponentClient({
    cookies,
  });
  await redirectToRelevantPage(supabase, redirect);
  return <div />;
}
