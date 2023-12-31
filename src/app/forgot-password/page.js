"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const promise = new Promise(async (resolve, reject) => {
        const res = await fetch("/api/forgotPassword", {
          method: "POST",
          headers: {
            "Context-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        });
        const data = await res.json();
        if (res.ok) resolve();
        else reject();
        if (data.success) {
          router.push("/reset-password");
        }
      });
      await toast.promise(promise, {
        loading: "Sending OTP...",
        success: "Sent OTP!",
        error: "error",
      });
    } catch (error) {
      console.error("Error sending forgot password OTP request:", error);
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg pt-10 px-5 pb-12 rounded-lg border-t-4 border-primary w-96">
        <h1 className="text-xl font-bold my-6">Forgot Password</h1>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <button
            type="submit"
            className="bg-primary text-white font-bold cursor-pointer px-6 py-2"
          >
            Submit
          </button>
          <Link className="text-sm mt-3 text-right" href={"/login"}>
            Already have an account?{" "}
            <span className="underline text-primary font-semibold">Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
