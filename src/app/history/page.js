"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [isEvaluate, setIsEvaluate] = useState(false);
  const [numberStar, setNumberStar] = useState(5);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [dataOrder, setDataOrder] = useState(null);
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
        setHistory(ordersUser);
      });
    });
  }, [session?.user?.email]);
  //   console.log(history);
  useEffect(() => {
    if (dataOrder) {
      fetch("/api/order", {
        method: "PUT",
        body: JSON.stringify(dataOrder),
        headers: { "Content-Type": "application/json" },
      });
    }
  }, [dataOrder]);
  async function handleFormSubmit(e, order) {
    e.preventDefault();
    try {
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
        setDataOrder(() => {
          return {
            ...order,
            evaluate: true,
          };
        });
        setComment("");
        setNumberStar(5);
        if (response.ok) resolve();
        else reject();
      });
      await toast.promise(savingPromise, {
        loading: "Saving this item...",
        success: "Saved!",
        error: "Error!",
      });
      router.replace("/event/" + order.ticketId + "#comment");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <h1>History</h1>
      {history?.length > 0 &&
        history.map((order) => (
          <div className="" key={order._id}>
            {order._id}
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
              <div>Giảm: {order.discount}</div>
              <div>Tổng cộng thanh toán: {order.sum - order.discount}</div>
            </div>
            {order.evaluate === false && (
              <button
                onClick={() => {
                  setOrderId(order._id);
                  setIsEvaluate(true);
                }}
              >
                Đánh giá
              </button>
            )}
            {isEvaluate && orderId === order._id && (
              <div className="bg-white px-8 py-6">
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
                  <div
                    onClick={() => {
                      setIsEvaluate(false);
                      setOrderId("");
                    }}
                  >
                    x
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
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
                    <select
                      className="w-32"
                      value={numberStar}
                      onChange={(e) => setNumberStar(e.target.value)}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                  </div>
                  <button
                    className="w-24 mb-4 mt-6"
                    onClick={(e) => handleFormSubmit(e, order)}
                  >
                    Gửi
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
