"use client";

import Left from "@/components/Icons/Left";
import { useProfile } from "@/components/Layout/UseProfile";
import UserForm from "@/components/Layout/UserForm";
import UserTabs from "@/components/Layout/UserTabs";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function UsersPage() {
  const { loading, data } = useProfile();
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/profile?_id=" + id).then((res) => {
      res.json().then((user) => {
        setUser(user);
      });
    });
  }, []);

  async function handleSaveButtonClick(e, data) {
    e.preventDefault();
    try {
      const savingPromise = new Promise(async (resolve, reject) => {
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, _id: id }),
        });
        if (response.ok) {
          resolve();
        } else reject();
      });
      await toast.promise(savingPromise, {
        loading: "Saving...",
        success: "Profile saved!",
        error: "Error!",
      });
    } catch (error) {
      console.log(error);
    }
  }
  if (loading) return "Loading user info...";
  if (!data?.admin) return "Not an admin";
  return (
    <section className="mt-8 mx-auto max-w-2xl">
      <UserTabs isAdmin={data.admin} />
      <div className="mt-8">
        <Link className="button flex" href={"/users"}>
          <Left />
          <span>Users page</span>
        </Link>
      </div>
      <h1 className="text-center text-primary text-4xl pt-10 font-semibold italic p-4">
        Edit User
      </h1>
      <div className="mt-8">
        {user && <UserForm user={user} onSave={handleSaveButtonClick} />}
      </div>
    </section>
  );
}
