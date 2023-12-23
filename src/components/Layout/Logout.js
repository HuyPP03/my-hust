"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LogoutButton() {
  const [showConfirm, setShowConfirm] = useState(false);

  if (showConfirm) {
    return (
      <div className="absolute bg-slate-200/60 inset-0 flex items-center h-full justify-center">
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
              }}
            >
              Yes,&nbsp;Logout!
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
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
  );
}
