import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

async function redirectToRelevantPage(
  supabaseClient,
  redirect
) {
  const data = await supabaseClient.auth.getSession();
  console.log(data);
  // if (!user) {
  //   redirect("/login");
  //   return;
  // }
  // const emailDomain = user.email.split("@")[1];
  // if (emailDomain === "sst.edu.sg") {
  //   redirect("/admin");
  //   return;
  // }
  // redirect("/student");
}

export default async function Home() {
  const supabase = createServerComponentClient({
    cookies,
  });
  const data = await supabase.auth.getSession();
  console.log(data);
  // await redirectToRelevantPage(supabaseClient, redirect);
  return <div />;
}
