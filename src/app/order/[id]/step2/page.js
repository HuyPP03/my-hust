"use client";

import { redirect, useParams } from "next/navigation";
import { CartContext } from "@/app/Providers";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Clock from "@/components/Icons/Clock";
import Map from "@/components/Icons/Map";
import upperCase from "@/libs/upperCase";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function Step2Page() {
  const { id } = useParams();
  const { data: session, status, update } = useSession();

  const { cartProducts } = useContext(CartContext);
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sum, setSum] = useState(0);
  const date = new Date(menuItem?.date);
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
  useEffect(() => {
    setLoading(true);
    fetch("/api/menu-items").then((res) => {
      res.json().then((items) => {
        const item = items.find((i) => i._id === id);
        setMenuItem(item);
        setLoading(false);
      });
    });
  }, []);
  useEffect(() => {
    const total = cartProducts.reduce((acc, item) => {
      return acc + item.quantity * item.price;
    }, 0);
    setSum(total);
  }, [cartProducts, menuItem]);
  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const savingPromise = new Promise(async (resolve, reject) => {
        const response = await fetch("/api/order", {
          method: "POST",
          body: JSON.stringify({
            ticketId: id,
            userEmail: user?.email,
            phone: user?.phone,
            cartProducts,
          }),
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
    } catch (error) {
      console.log(error);
    }
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
    console.log(date);
    return daysOfWeek[dayIndex];
  };
  if (loading) return "Loading...";
  if (status === "loading" || !profileFetched) {
    return "Loading...";
  } else if (status === "unauthenticated") {
    redirect("/login");
  }
  console.log(cartProducts);
  return (
    <section className="bg-gray-100">
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
        <div className="flex justify-center border py-2 text-green-600 font-semibold">
          Thanh toán
        </div>
        <div className="flex justify-center border py-2 text-gray-600 font-medium">
          Hoàn tất
        </div>
      </div>
      <div className="flex mt-8 ml-8 gap-8">
        <div className="flex-1">
          <div className="pb-2 pt-4 border-b-4 font-semibold text-gray-500">
            THÔNG TIN NGƯỜI NHẬN VÉ
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div>Họ tên</div>
              <input
                type="text"
                value={user?.name}
                onChange={(e) =>
                  setUser((prevUser) => ({ ...prevUser, name: e.target.value }))
                }
              />
            </div>
            <div>
              <div>Email</div>
              <input
                type="email"
                value={user?.email}
                onChange={(e) =>
                  setUser((prevUser) => ({
                    ...prevUser,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <div>Số điện thoại</div>
              <input
                type="tel"
                value={user?.phone}
                onChange={(e) =>
                  setUser((prevUser) => ({
                    ...prevUser,
                    phone: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <div>Địa chỉ</div>
              <input
                type="text"
                value={user?.address}
                onChange={(e) =>
                  setUser((prevUser) => ({
                    ...prevUser,
                    address: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="pb-2 pt-4 border-b-4 font-semibold text-gray-500">
            HÌNH THỨC THANH TOÁN
          </div>
          <div className="pb-2 pt-4 font-semibold text-gray-500">
            THANH TOÁN TRỰC TUYẾN
          </div>
        </div>
        <div>
          <div>
            <div className="w-80 bg-white px-6">
              <div className="pb-2 pt-4 border-b-4 font-semibold text-gray-700">
                THÔNG TIN NGƯỜI NHẬN VÉ
              </div>

              <div className="py-4 text-gray-500 grid grid-cols-2 border-t border-dashed">
                <div>Họ tên</div>
                <div className="flex justify-end">{session?.user?.name}</div>
              </div>
              <div className="py-4 text-gray-500 grid grid-cols-2 border-t border-dashed">
                <div>Email</div>
                <div className="flex justify-end">{session?.user?.email}</div>
              </div>
              <div className="py-4 text-gray-500 grid grid-cols-2 border-t border-dashed">
                <div>Điện thoại</div>
                <div className="flex justify-end"></div>
              </div>
              <div className="pb-2 pt-4 border-b-4 font-semibold text-gray-700">
                HÌNH THỨC THANH TOÁN
              </div>
              <div className="pb-2 pt-4 font-semibold text-gray-700">
                THANH TOÁN TRỰC TUYẾN
              </div>
              <div className="pt-4 text-gray-500 font-medium">Momo</div>
              <div className="pb-2 pt-4 border-b-4 font-semibold text-gray-700">
                THÔNG TIN ĐẶT VÉ
              </div>
              {cartProducts.length > 0 && (
                <div>
                  <div className="pb-8 pt-4 text-gray-500 font-medium grid grid-cols-2">
                    <div>Loại vé</div>
                    <div className="flex justify-end">Số lượng</div>
                  </div>
                  {cartProducts.map((o, index) => (
                    <div
                      key={index}
                      className="py-4 text-gray-500 grid grid-cols-2 border-t border-dashed"
                    >
                      <div>
                        <div>{o.name}</div>
                        <div className="text-xs">{o.price} VND</div>
                      </div>
                      <div className="flex justify-end flex-col">
                        <div className="flex justify-end">{o.quantity}</div>
                        <div className="text-xs flex justify-end">
                          {o.price * o.quantity} VND
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-between bg-orange-900 text-white px-6 py-4 font-medium">
              <div>Tổng cộng</div>
              <div>{sum} VND</div>
            </div>
          </div>
          <button
            className="mt-8 p-4 flex justify-center bg-green-600 text-white font-semibold text-lg rounded-none"
            onClick={(e) => handleFormSubmit(e)}
          >
            Thanh toán
          </button>
        </div>
      </div>
    </section>
  );
}
