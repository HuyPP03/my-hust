"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserTabs from "@/components/Layout/UserTabs";
import UserForm from "@/components/Layout/UserForm";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile").then((response) => {
        response.json().then((data) => {
          setUser(data);
          setIsAdmin(data.admin);
          setProfileFetched(true);
        });
      });
    }
  }, [session, status]);
  async function handleProfileInfoUpdate(e, data) {
    e.preventDefault();
    try {
      const savingPromise = new Promise(async (resolve, reject) => {
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          resolve();
        } else reject();
      });
      toast.promise(savingPromise, {
        loading: "Saving...",
        success: "Profile saved!",
        error: "Error!",
      });
    } catch (error) {
      console.log(error);
    }
  }
  if (status === "loading" || !profileFetched) {
    return "Loading...";
  } else if (status === "unauthenticated") {
    redirect("/login");
  }
  return (
    <section className="mt-8">
      <UserTabs isAdmin={isAdmin} />
      <h1 className="text-center text-primary text-4xl pt-10 font-semibold italic p-4">
        Profile
      </h1>
      <div className="max-w-2xl mx-auto">
        <UserForm user={user} onSave={handleProfileInfoUpdate} />
      </div>
    </section>
  );
}
