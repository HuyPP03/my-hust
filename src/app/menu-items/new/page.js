"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useProfile } from "@/components/Layout/UseProfile";
import UserTabs from "@/components/Layout/UserTabs";
import React from "react";
import Link from "next/link";
import Left from "@/components/Icons/Left";
import { redirect } from "next/navigation";
import MenuItemForm from "@/components/Layout/MenuItemForm";

export default function NewMenuItemPage() {
  const { loading, data } = useProfile();
  const [redirectToItems, setRedirectToItems] = useState(false);
  async function handleFormSubmit(e, data) {
    e.preventDefault();
    try {
      const savingPromise = new Promise(async (resolve, reject) => {
        const response = await fetch("/api/menu-items", {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) resolve();
        else reject();
      });
      await toast.promise(savingPromise, {
        loading: "Saving this item...",
        success: "Saved!",
        error: "Error!",
      });
      setRedirectToItems(true);
    } catch (error) {
      console.log(error);
    }
  }
  if (redirectToItems) {
    return redirect("/menu-items");
  }
  if (loading) return "Loading user profile...";
  if (!data.admin) return "Not an admin.";
  return (
    <section className="mt-8">
      <UserTabs isAdmin={data.admin} />
      <div className="mt-8 max-w-2xl mx-auto">
        <Link className="button" href={"/menu-items"}>
          <Left />
          <span>Show all menu items</span>
        </Link>
      </div>
      <h1 className="text-center text-primary text-4xl pt-10 font-semibold italic p-4">
        Create concert
      </h1>
      <MenuItemForm menuItem={null} onSubmit={handleFormSubmit} />
    </section>
  );
}
