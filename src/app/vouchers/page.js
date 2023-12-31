"use client";

import UserTabs from "@/components/Layout/UserTabs";
import { useProfile } from "@/components/Layout/UseProfile";
import Link from "next/link";
import Right from "@/components/Icons/Right";
import { useEffect, useState } from "react";

export default function MenuItemsPage() {
  const { loading, data } = useProfile();
  const [vouchers, setVouchers] = useState([]);
  useEffect(() => {
    fetch("/api/voucher").then((res) => {
      res.json().then((vouchers) => {
        vouchers = vouchers.reverse();
        setVouchers(vouchers);
      });
    });
  }, []);
  if (loading) return "Loading user profile...";
  if (!data?.admin) return "Not an admin.";
  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={data.admin} />
      <div className="mt-8">
        <Link className="button flex" href={"/vouchers/new"}>
          <span>Create new voucher</span>
          <Right />
        </Link>
      </div>
      <h1 className="text-center text-primary text-4xl pt-10 font-semibold italic p-4">
        Existing vouchers
      </h1>
      <div>
        <h2 className="text-sm text-gray-500 mt-4">Edit voucher</h2>
        <div className="grid grid-cols-2 gap-2">
          {vouchers?.length > 0 &&
            vouchers.map((item) => (
              <Link
                href={"/vouchers/edit/" + item._id}
                className="button mb-2 flex-col"
                key={item._id}
              >
                <div>{item.voucherCode}</div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
