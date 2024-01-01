"use client";

import { redirect, useParams, useRouter } from "next/navigation";
import { CartContext } from "@/app/Providers";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Clock from "@/components/Icons/Clock";
import Map from "@/components/Icons/Map";
import upperCase from "@/libs/upperCase";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import ChevronUp from "@/components/Icons/ChevronUp";
import ChevronDown from "@/components/Icons/ChevronDown";
import Minus from "@/components/Icons/Minus";
import Right from "@/components/Icons/Right";
import Close from "@/components/Icons/Close";
import ReceiptPercent from "@/components/Icons/ReceiptPercent";
import DatePage from "@/libs/date";
export default function Step2Page() {
  const { id } = useParams();
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { cartProducts } = useContext(CartContext);
  const [order, setOrder] = useState(cartProducts);
  // console.log(order);
  const [menuItem, setMenuItem] = useState(null);
  const [data, setData] = useState(null);
  const [dataVoucher, setDataVoucher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sum, setSum] = useState(0);
  const date = new Date(menuItem?.date);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isOpenVoucher, setIsOpenVoucher] = useState(false);
  const [isOpenVouchers, setIsOpenVouchers] = useState(false);
  const [clickedVoucher, setClickedVoucher] = useState(null);
  const { addToCart } = useContext(CartContext);
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
      });
    });
    fetch("/api/voucher").then((res) => {
      res.json().then((items) => {
        const currentDate = new Date();
        const filteredVouchers = items.filter((voucher) => {
          const fromTime = new Date(voucher.fromTime);
          const toTime = new Date(voucher.toTime);

          return currentDate >= fromTime && currentDate <= toTime;
        });

        setVouchers(filteredVouchers);
      });
    });
    setLoading(false);
  }, []);
  useEffect(() => {
    const total = order.reduce((acc, item) => {
      return acc + item.quantity * item.price;
    }, 0);
    setSum(total);
  }, [order]);
  useEffect(() => {
    console.log(data);
    if (data?._id === id) {
      fetch("/api/menu-items", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    }
  }, [data, id]);
  useEffect(() => {
    if (dataVoucher) {
      fetch("/api/voucher", {
        method: "PUT",
        body: JSON.stringify(dataVoucher),
        headers: { "Content-Type": "application/json" },
      });
    }
  }, [dataVoucher]);
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
            sum,
            discount: selectedVoucher?.discount || 0,
          }),
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          const updatedTypes = menuItem.types.map((type) => {
            const orderedItem = order.find((item) => item.name === type.name);
            if (orderedItem) {
              return {
                ...type,
                quantity: type.quantity - orderedItem.quantity,
              };
            }

            return type;
          });

          setData(() => ({
            ...menuItem,
            types: updatedTypes,
          }));
          if (dataVoucher) {
            setDataVoucher((prev) => {
              return {
                ...prev,
                quantity: prev.quantity - 1,
              };
            });
          }
          router.replace("/order/step3/" + data._id);
          resolve();
        } else reject();
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
  const handleVoucherChange = (voucher) => {
    if (clickedVoucher === voucher._id) {
      setClickedVoucher(null);
      setSelectedVoucher(null); // Deselect the voucher
    } else {
      setClickedVoucher(voucher._id);
    }
  };
  const handleApplyVoucher = () => {
    if (clickedVoucher !== null) {
      const selectedVoucher = vouchers.find(
        (voucher) => voucher._id === clickedVoucher
      );
      console.log(selectedVoucher);
      const selectedVoucherObject = {
        name: selectedVoucher.voucherCode,
        discount:
          selectedVoucher.percent > 0
            ? (selectedVoucher.percent / 100) * sum
            : selectedVoucher.amountMoney,
      };
      setSelectedVoucher(selectedVoucherObject);
      setDataVoucher(selectedVoucher);
    }
  };
  const getFormattedDay = () => {
    const date = new Date(menuItem?.date);
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayIndex = date?.getDay();
    return daysOfWeek[dayIndex];
  };
  if (loading) return "Loading...";
  if (status === "loading" || !profileFetched) {
    return "Loading...";
  } else if (status === "unauthenticated") {
    redirect("/login");
  }
  return (
    <section className="bg-gray-100 relative">
      {isOpenVouchers && (
        <div className="fixed w-full h-full bg-black/60 top-0 left-0 z-[9999]  flex justify-center items-center">
          <div className="w-[600px] bg-white my-20 max-h-[650px] rounded-3xl overflow-hidden">
            <div className="flex flex-col gap-3 justify-end rounded-tr-3xl overflow-hidden sticky">
              <div
                className="bg-primary w-fit flex px-3 py-1 text-white h-fit cursor-pointer items-end ml-auto"
                onClick={() => setIsOpenVouchers(false)}
              >
                <span>Close</span>
                <Close />
              </div>
              <div className="text-2xl text-gray-700 font-semibold mb-4 ml-6">
                Vouchers
              </div>
            </div>
            <div className="ml-6 my-1 overflow-y-scroll max-h-[550px]">
              {vouchers?.length > 0 &&
                vouchers.map((voucher) => (
                  <div key={voucher._id} className="py-4 border-t">
                    <div className="flex gap-2 items-center mb-2">
                      <div className="text-primary">
                        <ReceiptPercent className="w-5 h-5" />
                      </div>
                      <span className="text-lg">{voucher.name}</span>
                    </div>
                    <div className="text-sm flex flex-col gap-1">
                      <div className="text-primary">
                        <span>Discount: </span>
                        {voucher.percent > 0
                          ? voucher.percent + "%"
                          : voucher.amountMoney + "đ"}
                        <span> - Code: </span>
                        {voucher.voucherCode}
                      </div>
                      <div>
                        Applicable date:{" "}
                        {DatePage(voucher.fromTime) +
                          " - " +
                          DatePage(voucher.toTime)}
                      </div>
                      <div>Expiration date: {DatePage(voucher.toTime) + " 23:59"}</div>
                      <div>Remaining number of vouchers: {voucher.quantity}</div>
                      <span>Quantity of discount is limited</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
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
          <Link href={"/order/" + id}>Select ticket</Link>
        </div>
        <div className="flex justify-center border py-2 text-green-600 font-semibold">
          Pay
        </div>
        <div className="flex justify-center border py-2 text-gray-600 font-medium">
          Complete
        </div>
      </div>
      <div className="flex mt-8 ml-8 gap-8">
        <div className="flex-1">
          <div className="pb-2 pt-4 border-b-4 font-semibold text-gray-500">
            TICKET RECEIVER INFORMATION
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div>Full name</div>
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
              <div>Phone number</div>
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
              <div>Address</div>
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
            PAYMENT METHOD
          </div>
          <div className="pb-2 pt-4 font-semibold text-gray-500">
            ONLINE PAYMENT
          </div>
        </div>
        <div>
          <div>
            <div className="w-80 bg-white px-6">
              <div className="pb-2 pt-4 border-b-4 font-semibold text-gray-700">
              TICKET RECEIVER INFORMATION
              </div>

              <div className="py-4 text-gray-500 grid grid-cols-2 border-t border-dashed">
                <div>Full name</div>
                <div className="flex justify-end">{session?.user?.name}</div>
              </div>
              <div className="py-4 text-gray-500 grid grid-cols-2 border-t border-dashed">
                <div>Email</div>
                <div className="flex justify-end">{session?.user?.email}</div>
              </div>
              <div className="py-4 text-gray-500 grid grid-cols-2 border-t border-dashed">
                <div>Phone number</div>
                <div className="flex justify-end"></div>
              </div>
              <div className="pb-2 pt-4 border-b-4 font-semibold text-gray-700">
               PAYMENT METHOD
              </div>
              <div className="pt-4 text-gray-500 font-medium">Momo</div>
              <div className="pb-2 pt-4 border-b-4 font-semibold text-gray-700 flex justify-between">
                <div>TICKET BUYING INFORMATION</div>
                <Link href={"/order/" + id} onClick={() => addToCart(order)}>
                  Sửa
                </Link>
              </div>
              {order.length > 0 && (
                <div>
                  <div className="pb-8 pt-4 text-gray-500 font-medium grid grid-cols-2">
                    <div>Type</div>
                    <div className="flex justify-end">Quantity</div>
                  </div>
                  {order.map((o, index) => (
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
                  {selectedVoucher !== null && (
                    <div>
                      <div className="pb-2 pt-4 text-gray-500 font-medium grid grid-cols-2">
                        <div>Voucher</div>
                        <div className="flex justify-end">Discount</div>
                      </div>
                      <div className="pb-8 text-gray-500 font-normal text-xs grid grid-cols-2">
                        <div>{selectedVoucher.name}</div>
                        <div className="flex justify-end items-center">
                          <Minus className="w-3 h-3" />{" "}
                          {selectedVoucher.discount} VND
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="py-8 mt-4 text-gray-500 font-medium bg-white px-6">
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <div> Select voucher ({vouchers.length})</div>
                  {isOpenVoucher && (
                    <div onClick={() => setIsOpenVoucher(false)}>
                      <ChevronUp />
                    </div>
                  )}
                  {!isOpenVoucher && (
                    <div onClick={() => setIsOpenVoucher(true)}>
                      <ChevronDown />
                    </div>
                  )}
                </div>
                <div
                  className="flex gap-2 text-primary text-[14px] items-center hover:underline cursor-pointer"
                  onClick={() => setIsOpenVouchers(true)}
                >
                  <span>All</span>
                  <Right className="w-4 h-4" />
                </div>
              </div>
              {isOpenVoucher && (
                <div className="flex flex-col gap-2 mt-4">
                  {vouchers.map((voucher) => (
                    <div key={voucher._id}>
                      <label className="flex items-center justify-between">
                        <span className="ml-2">
                          {voucher.name} -{" "}
                          {voucher.percent > 0
                            ? voucher.percent + "%"
                            : voucher.amountMoney + "đ"}
                        </span>
                        <input
                          type="radio"
                          name="voucher"
                          value={voucher._id}
                          checked={clickedVoucher === voucher._id}
                          onClick={() => {
                            if (voucher?.quantity <= 0)
                              toast.error("Voucher đã hết!");
                            else handleVoucherChange(voucher);
                          }}
                        />
                      </label>
                    </div>
                  ))}
                  {clickedVoucher !== null && (
                    <button
                      className=" mt-8 bg-primary text-white border-0"
                      onClick={() => handleApplyVoucher()}
                    >
                      {selectedVoucher === null ? "Chọn" : "Đã chọn"}
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-between bg-orange-900 text-white px-6 py-4 font-medium">
              <div>Total</div>
              <div>
                {selectedVoucher === null
                  ? sum
                  : sum - selectedVoucher.discount}{" "}
                VND
              </div>
            </div>
          </div>
          <button
            className="mt-8 p-4 flex justify-center bg-green-600 text-white font-semibold text-lg rounded-none"
            onClick={(e) => handleFormSubmit(e)}
          >
            Pay
          </button>
        </div>
      </div>
    </section>
  );
}
