"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Tippy from "@tippyjs/react/headless";
import Image from "next/image";
import LogoutPage from "./Logout";
import LogoutButton from "./Logout";
export function Header() {
  const { data: session, status, update } = useSession();
  let userName = session?.user.name || session?.user.email;
  const userEmail = session?.user.email;
  const userAvatar = session?.user.image;
  if (userName && userName.includes(" ")) {
    userName = userName.split(" ")[userName.split(" ").length - 1];
  }

  return (
    <header className="grid items-center grid-cols-4 py-6 border-b-2 sticky top-0 bg-white z-50">
      <Link className="text-primary font-semibold text-2xl" href="/">
        HUSTENTERTAINMENT
      </Link>
      <nav className="flex col-span-2 items-center justify-end gap-6 text-gray-500 font-semibold">
        <Link href="/">Home</Link>
        <Link href="/menu">Menu</Link>
        <Link href="/about">About</Link>
        <Link href="contact">Contact</Link>
      </nav>
      <nav className="flex items-center gap-4 justify-end text-gray-500 font-semibold">
        {status === "unauthenticated" && (
          <>
            <Link
              href="/register"
              className="bg-while rounded-full text-gray-500 px-6 py-2 border-solid border-primary border-2"
            >
              Register
            </Link>
            <Link
              href="/login"
              className="bg-primary rounded-full text-white px-6 py-2 border-solid border-primary border-2"
            >
              Login
            </Link>
          </>
        )}
        {status === "authenticated" && (
          <>
            <Image
              src={"/notifications.png"}
              alt={"notification"}
              width={27}
              height={27}
              className="rounded-full"
            />
            <Tippy
              render={(attrs) => (
                <div
                  className="bg-white w-72 shadow-3xl p-4 rounded-lg"
                  tabIndex="-1"
                  {...attrs}
                >
                  <div className="flex gap-4 items-center pb-4 border-b-2">
                    <Image
                      src={userAvatar}
                      alt={"avatar"}
                      width={54}
                      height={54}
                      className="rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="text-slate-800">
                        {session?.user.name}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {userEmail}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 font-medium text-slate-700 py-2 border-b-2"
                  >
                    <Image
                      src={"/profile.jpg"}
                      alt={""}
                      width={20}
                      height={20}
                      className="w-5"
                    />
                    Profile
                  </Link>
                  <LogoutButton />
                </div>
              )}
              trigger="click"
              placement="bottom-end"
              interactive={true}
            >
              <div className="flex items-center gap-2  cursor-pointer">
                <Image
                  src={userAvatar}
                  alt={"avatar"}
                  width={35}
                  height={35}
                  className="rounded-full"
                />
                <div>Hello, {userName}</div>
              </div>
            </Tippy>
          </>
        )}
      </nav>
    </header>
  );
}
