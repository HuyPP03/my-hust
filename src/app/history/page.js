"use client";

import Close from "@/components/Icons/Close";
import Right from "@/components/Icons/Right";
import DatePage from "@/libs/date";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [numberStar, setNumberStar] = useState(0);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);
  const [dataOrder, setDataOrder] = useState(null);
  const [clickId, setClickId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile").then((response) => {
        response.json().then((data) => {
          setUser(data);
        });
      });
    }
  }, [session, status]);
  useEffect(() => {
    fetch("/api/order").then((response) => {
      response.json().then((orders) => {
        const ordersUser = orders.filter(
          (o) => o.userEmail === session?.user?.email
        );
        const fetchItems = async () => {
          const historyArray = [];

          for (const o of ordersUser) {
            try {
              const response = await fetch("/api/menu-items");
              const items = await response.json();
              const item = items.find((i) => i._id === o.ticketId);

              if (item) {
                const mergedItem = {
                  ...item,
                  ...o,
                };

                historyArray.push(mergedItem);
              }
            } catch (error) {
              console.error("Error fetching menu items", error);
            }
          }

          setHistory(historyArray.reverse());
        };

        fetchItems();
      });
    });
  }, [session?.user?.email]);
  useEffect(() => {
    if (dataOrder) {
      fetch("/api/order", {
        method: "PUT",
        body: JSON.stringify(dataOrder),
        headers: { "Content-Type": "application/json" },
      });
    }
  }, [dataOrder]);
  async function handleFormSubmit(e, id) {
    e.preventDefault();
    try {
      const response = await fetch("/api/order");
      const orders = await response.json();
      const order = orders.find((o) => o._id === id);

      if (!order) {
        throw new Error("Order not found");
      }

      setDataOrder({
        ...order,
        evaluate: true,
      });
      const savingPromise = new Promise(async (resolve, reject) => {
        const response = await fetch("/api/comment", {
          method: "POST",
          body: JSON.stringify({
            ticketId: order?.ticketId,
            userName: user?.name,
            userImage: user?.image,
            comment,
            numberStar,
          }),
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          setComment("");
          setNumberStar(0);
          resolve();
          router.replace("/event/" + order.ticketId + "#comment");
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
  return (
    <div>
      <h1 className="mt-8 flex justify-center text-3xl font-semibold text-primary">
        Lịch sử mua vé
      </h1>
      {history?.length > 0 &&
        history.map((order) => (
          <div className="m-4" key={order._id}>
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-0">
                <div className="text-gray-500 font-semibold text-lg flex gap-3 items-center">
                  <div>
                    <Image
                      src={"/order.jpg"}
                      alt={"order"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                  {order.name + " - " + DatePage(order.createdAt)}
                </div>
                <div className="text-primary text-sm ml-2">
                  {order.evaluate && "Đã đánh giá"}
                  {!order.evaluate && "Đánh giá ngay"}
                </div>
              </div>
              <div
                className="flex items-center gap-2 text-sm text-primary hover:underline"
                onClick={() => {
                  setClickId(order._id);
                  setIsOpen(true);
                }}
              >
                Xem chi tiết <Right className="w-4 h-4" />
              </div>
            </div>
            {isOpen && clickId === order._id && (
              <div className="fixed w-full h-full bg-black/60 top-0 left-0 z-[1000]  flex justify-center items-center">
                <div className="w-[600px] bg-white my-20 max-h-[650px] rounded-3xl overflow-hidden pb-8">
                  <div className="flex flex-col gap-3 justify-end rounded-tr-3xl overflow-hidden sticky">
                    <div
                      className="bg-primary w-fit flex px-3 py-1 text-white h-fit cursor-pointer items-end ml-auto"
                      onClick={() => {
                        setIsOpen(false);
                        setClickId("");
                      }}
                    >
                      <span>Đóng</span>
                      <Close />
                    </div>
                    <div className="text-2xl text-gray-700 font-semibold mb-4 ml-6">
                      Thông tin chi tiết
                    </div>
                  </div>
                  <div className="my-1 overflow-y-scroll max-h-[550px]">
                    <div className="mx-6 text-gray-600 font-medium text-lg mb-2">
                      Sự kiện: {order.name}
                    </div>
                    <div className="mx-6 text-gray-600 font-medium text-lg mb-2">
                      Thời gian: {order.time + " - " + DatePage(order.date)}
                    </div>
                    <div className="mx-6 text-gray-600 font-medium text-lg mb-2">
                      Các loại vé đã mua
                    </div>
                    <div className="mx-6">
                      {order.cartProducts.map((o, index) => (
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
                      <div>
                        <div className=" text-gray-600 font-medium text-lg mb-2">
                          Giảm: {order.discount}
                        </div>
                        <div className=" text-gray-600 font-medium text-lg mb-2">
                          Tổng cộng thanh toán: {order.sum - order.discount}
                        </div>
                      </div>
                      {order.evaluate === false && (
                        <div className="bg-white py-6">
                          <div className="flex gap-3 items-center">
                            <Image
                              src={session?.user?.image}
                              alt=""
                              width={35}
                              height={35}
                              className="rounded-full"
                            />
                            <div className="font-medium text-lg">
                              {session?.user?.name}
                            </div>
                          </div>
                          <div className="mt-2 flex flex-col">
                            <div className="w-[500px]">
                              <div>Bình luận</div>
                              <input
                                type="text"
                                className="w-80"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                              />
                            </div>
                            <div>
                              <div>Số sao</div>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((index) => (
                                  <span
                                    key={index}
                                    className={`cursor-pointer text-2xl leading-4 ${
                                      index <= numberStar
                                        ? "text-[#ffcc02]"
                                        : "text-black"
                                    } rounded-full`}
                                    onClick={() => setNumberStar(index)}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                            <button
                              className="w-24 mb-4 mt-2"
                              onClick={(e) => handleFormSubmit(e, order._id)}
                            >
                              Gửi
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
