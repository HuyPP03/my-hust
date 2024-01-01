"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Tippy from "@tippyjs/react/headless";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export function Header() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [admin, setAdmin] = useState(false);
  let userName = session?.user.name || session?.user.email;
  const userEmail = session?.user.email;
  const userAvatar = session?.user.image;

  useEffect(() => {
    if (session?.user) {
      fetch("/api/users").then((res) =>
        res.json().then((users) => {
          const user = users.find((u) => u.email === session?.user.email);
          setAdmin(user.admin);
        })
      );
    }
  }, [session]);
  if (userName && userName.includes(" ")) {
    userName = userName.split(" ")[userName.split(" ").length - 1];
  }

  return (
    <header className="grid items-center grid-cols-4 py-6 border-b-2 sticky top-0 bg-white z-50">
      {showConfirm && (
        <div className="fixed h-screen w-screen top-0 left-0 z-[999999999]">
          <div className="bg-white/60 inset-0 flex items-center h-full justify-center">
            <div className="bg-white p-4 rounded-lg">
              <div>Are you sure you want to logout?</div>
              <div className="flex gap-2 mt-1">
                <button type="button" onClick={() => setShowConfirm(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="primary"
                  onClick={() => {
                    signOut();
                    setShowConfirm(false);
                    // router.replace("/");
                  }}
                >
                  Yes,&nbsp;Logout!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
                  {admin && (
                    <>
                      <Link
                        href="/categories"
                        className="flex items-center gap-2 font-medium text-slate-700 py-2 border-b-2"
                      >
                        <Image
                          src={"/categories.png"}
                          alt={""}
                          width={20}
                          height={20}
                          className="w-5"
                        />
                        Categories
                      </Link>
                      <Link
                        href="/menu-items"
                        className="flex items-center gap-2 font-medium text-slate-700 py-2 border-b-2"
                      >
                        <Image
                          src={"/tickets.png"}
                          alt={""}
                          width={20}
                          height={20}
                          className="w-5"
                        />
                        Tickets
                      </Link>
                      <Link
                        href="/users"
                        className="flex items-center gap-2 font-medium text-slate-700 py-2 border-b-2"
                      >
                        <Image
                          src={"/users.webp"}
                          alt={""}
                          width={20}
                          height={20}
                          className="w-5"
                        />
                        Users
                      </Link>
                      <Link
                        href="/vouchers"
                        className="flex items-center gap-2 font-medium text-slate-700 py-2 border-b-2"
                      >
                        <Image
                          src={"/vouchers.png"}
                          alt={""}
                          width={20}
                          height={20}
                          className="w-5"
                        />
                        Vouchers
                      </Link>
                    </>
                  )}
                  <Link
                    href="/history"
                    className="flex items-center gap-2 font-medium text-slate-700 py-2 border-b-2"
                  >
                    <Image
                      src={"/history.jpg"}
                      alt={""}
                      width={20}
                      height={20}
                      className="w-5"
                    />
                    History
                  </Link>
                  <div>
                    <div
                      onClick={() => setShowConfirm(true)}
                      className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 py-2 border-b-2"
                    >
                      <Image
                        src={"/logout.png"}
                        alt={""}
                        width={20}
                        height={20}
                        className="w-5"
                      />
                      Log Out
                    </div>
                  </div>
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
