"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const promise = new Promise(async (resolve, reject) => {
        const res = await fetch("/api/resetPassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp, newPassword }),
        });
        const data = await res.json();

        if (res.ok) resolve();
        else reject();
        if (data.success) {
          router.push("/login");
        }
      });
      await toast.promise(promise, {
        loading: "Resetting...",
        success: "Reseted password!",
        error: "error",
      });
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-primary w-96">
        <h1 className="text-xl font-bold my-6">Reset Password</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            OTP:
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </label>
          <label>
            New Password:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
          <button
            type="submit"
            className="bg-primary text-white font-bold cursor-pointer px-6 py-2"
          >
            Reset
          </button>
        </form>
      </div>
    </div>
  );
}
