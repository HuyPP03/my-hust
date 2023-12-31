"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useProfile } from "@/components/Layout/UseProfile";
import UserTabs from "@/components/Layout/UserTabs";
import React from "react";
import Link from "next/link";
import Left from "@/components/Icons/Left";
import { redirect, useParams } from "next/navigation";
import DeleteButton from "@/components/Layout/DeleteButton";
import VoucherForm from "@/components/Layout/VoucherForm";

export default function EditVoucherPage() {
  const { id } = useParams();
  const { loading, data } = useProfile();
  const [voucher, setVoucher] = useState(null);
  const [redirectToItems, setRedirectToItems] = useState(false);

  useEffect(() => {
    fetch("/api/voucher").then((res) => {
      res.json().then((items) => {
        const item = items.find((i) => i._id === id);
        setVoucher(item);
      });
    });
  }, []);
  async function handleFormSubmit(e, data) {
    e.preventDefault();
    try {
      data = { ...data, _id: id };
      const savingPromise = new Promise(async (resolve, reject) => {
        const response = await fetch("/api/voucher", {
          method: "PUT",
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
  async function handleDeleteClick() {
    try {
      const promise = new Promise(async (resolve, reject) => {
        const response = await fetch("/api/voucher?_id=" + id, {
          method: "DELETE",
        });
        if (response.ok) resolve();
        else reject();
      });
      await toast.promise(promise, {
        loading: "Deleting...",
        success: "Deleted!",
        error: "error",
      });
      setRedirectToItems(true);
    } catch (error) {
      console.log(error);
    }
  }
  if (redirectToItems) {
    return redirect("/vouchers");
  }
  if (loading) return "Loading user profile...";
  if (!data?.admin) return "Not an admin.";
  return (
    <section className="mt-8">
      <UserTabs isAdmin={data.admin} />
      <div className="mt-8 max-w-2xl mx-auto">
        <Link className="button" href={"/vouchers"}>
          <Left />
          <span>Show all vouchers</span>
        </Link>
      </div>
      <h1 className="text-center text-primary text-4xl pt-10 font-semibold italic p-4">
        Edit voucher
      </h1>
      {voucher && (
        <>
          <VoucherForm onSubmit={handleFormSubmit} voucher={voucher} />
          <div className="max-w-2xl mx-auto mt-4">
            <div className="max-w-2xl ml-auto">
              <DeleteButton
                label={"Delete this voucher"}
                onDelete={handleDeleteClick}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
