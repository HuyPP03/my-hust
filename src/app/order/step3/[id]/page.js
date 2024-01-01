"use client";

import Clock from "@/components/Icons/Clock";
import Map from "@/components/Icons/Map";
import upperCase from "@/libs/upperCase";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "qrcode.react";

export default function Page() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [menuItem, setMenuItem] = useState(null);
  const date = new Date(menuItem?.date);

  useEffect(() => {
    fetch("/api/order").then((response) => {
      response.json().then((orders) => {
        const order = orders.find((o) => o._id === id);
        setOrder(order);
      });
    });
  }, []);
  useEffect(() => {
    if (order) {
      fetch("/api/menu-items").then((response) => {
        response.json().then((menuItems) => {
          const menuItem = menuItems.find((i) => i._id === order.ticketId);
          setMenuItem(menuItem);
        });
      });
      sendMail(order._id, order.userEmail);
    }
  }, [order]);
  async function sendMail(id, email) {
    const res = await fetch("/api/sendQR", {
      method: "POST",
      headers: {
        "Context-Type": "application/json",
      },
      body: JSON.stringify({ id, email }),
    });
    console.log(res);
  }

  const getFormattedDay = () => {
    const date = new Date(menuItem?.date);
    const daysOfWeek = [
      "Chủ Nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    const dayIndex = date?.getDay();
    return daysOfWeek[dayIndex];
  };
  return (
    <secction>
      <div className="flex py-4 gap-6 px-12 text-white bg-gradient-to-r from-slate-700 to-blue-900">
        <div className="flex-1">
          <div className="text-3xl font-medium my-4">
            {upperCase(menuItem?.name)}
          </div>
          <div className="flex items-center gap-2 font-medium text-lg">
            <Clock className="w-5 h-5" />
            <div>
              {getFormattedDay()}, {date.getDate()} Tháng {date.getMonth() + 1}{" "}
              {date.getFullYear()}
            </div>
            <div>({menuItem?.time})</div>
          </div>
          <div className="flex items-center gap-2 font-medium text-lg">
            <Map className="w-5 h-5" />
            <div>{menuItem?.address}</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 bg-white">
        <div className="flex justify-center border py-2 font-medium text-gray-600">
          <Link href={"/order/" + id}>Chọn vé</Link>
        </div>
        <div className="flex justify-center border py-2 text-gray-600 font-medium">
          Thanh toán
        </div>
        <div className="flex justify-center border py-2 text-green-600 font-semibold">
          Hoàn tất
        </div>
      </div>
      <div className="text-primary font-semibold text-3xl flex justify-center mt-10">
        Mã QR bạn đã đặt vé
      </div>
      <div className="flex justify-center m-10">
        {order && <QRCode value={JSON.stringify(order._id)} size={400} />}
      </div>
    </secction>
  );
}
