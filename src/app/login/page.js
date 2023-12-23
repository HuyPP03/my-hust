"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleForgotPassword = () => {
    // Chuyển hướng đến trang quên mật khẩu
    router.push("/forgotpassword");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res.error) {
        setError("Invalid Credentials");
        return;
      }
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-primary w-96">
        <h1 className="text-xl font-bold my-4">Login</h1>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-primary text-white font-bold cursor-pointer px-6 py-2">
            Login
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}

          {/* Nút quên mật khẩu
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary mt-2 cursor-pointer"
          >
            Forgot Password?
          </button> */}

          <Link className="text-sm mt-3 text-right" href={"/register"}>
            Don&apos;t have an account?{" "}
            <span className="underline text-primary font-semibold">
              Register
            </span>
          </Link>
        </form>
      </div>
    </div>
  );
}
