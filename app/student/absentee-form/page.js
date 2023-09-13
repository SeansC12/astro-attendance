"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import icon from "@/public/loadingIcon.svg";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function absenteeForm() {
	const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [date, setDate] = useState("");
	const [reason, setReason] = useState("");
	const [error, setError] = useState("");
	const [submitted, setSubmitted] = useState(false);
	// const { data, error } = supabase.from("AbsenceRequests").select("*");
	var userEmail = "";
	async function handleSubmit() {
		const res = await supabase
			.from("AbsenceRequests")
			.insert({ name: name, email: email, reason: reason, absentDate: date });
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

	async function retrieveUserData() {
		const supabase = createClientComponentClient();
		const { data } = await supabase.auth.getUser();
		return data.user.email;
	}
	useEffect(() => {
		setEmail(retrieveUserData());
	}, []);

	return (
		<div className="">
			<div className="flex flex-col align-middle w-1/2 mx-auto text-center">
				<div className="flex flex-row items-center h-10">
					<p className="mr-2">Email:</p>
					{!email ? animatedLoading : email}
				</div>
				<input type="text" placeholder="Name" onChange={(input) => setName(input.target.value)} />
				{/* <input type="text" placeholder="Email" onChange={(input) => setEmail(input.target.value)} /> */}
				<input type="date" placeholder="Date" onChange={(input) => setDate(input.target.value)} />
				<input type="text" placeholder="Reason" onChange={(input) => setReason(input.target.value)} />
				<p>{error}</p>
				<input
					type="submit"
					onClick={handleSubmit}
					disabled={name == "" || email == "" || date == "" || reason == ""}
					className="disabled:bg-gray-500 bg-blue-400 text-gray-700 rounded-md p-2 w-min m-auto"
				/>
			</div>
			{submitted ? (
				<div>
					<p>Successfully submitted request</p>
					<a href="/">
						Back to home
					</a>
				</div>
			) : null}
		</div>
	);
}

const animatedLoading = (
	<div className="animate-spin m-1 w-fit h-fit">
		<Image className="w-5 h-5" src={icon} alt="Loading..."></Image>
	</div>
);
