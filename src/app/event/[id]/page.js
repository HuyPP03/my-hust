"use client";

import ChevronDown from "@/components/Icons/ChevronDown";
import ChevronUp from "@/components/Icons/ChevronUp";
import Clock from "@/components/Icons/Clock";
import Email from "@/components/Icons/Email";
import Map from "@/components/Icons/Map";
import Money from "@/components/Icons/Money";
import Phone from "@/components/Icons/Phone";
import upperCase from "@/libs/upperCase";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import NumberStar from "@/libs/numberStar";
import getTimeAgo from "@/libs/getTimeAgo";

export default function OrderPage() {
  const { id } = useParams();
  const { data: session, status, update } = useSession();
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [numberStar, setNumberStar] = useState(5);
  const [comment, setComment] = useState("");
  const [orderId, setOrderId] = useState("");

  const [commentsId, setCommentsId] = useState([]);
  const [user, setUser] = useState(null);
  const [existOrder, setExistOrder] = useState(false);
  const [order, setOrder] = useState([]);

  const date = new Date(menuItem?.date);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile").then((response) => {
        response.json().then((data) => {
          setUser(data);
          // setIsAdmin(data.admin);
          // setProfileFetched(true);
        });
      });
      fetchOrder();
    }
  }, [session, status]);
  function fetchOrder() {
    fetch("/api/order").then((res) => {
      res.json().then((items) => {
        setOrder(items);
      });
    });
  }
  useEffect(() => {
    setLoading(true);
    fetch("/api/menu-items").then((res) => {
      res.json().then((items) => {
        const item = items.find((i) => i._id === id);
        setMenuItem(item);
        setLoading(false);
      });
    });
    fetchComment();
  }, []);
  useEffect(() => {
    const item = order.filter(
      (i) => i.ticketId === id && i.userEmail === session?.user?.email
    );
    if (item?.length > 0) {
      setExistOrder(true);
      setOrderId(item[0]?._id);
    }
  }, [order, id, session]);
  console.log(orderId);
  function fetchComment() {
    fetch("/api/comment").then((res) => {
      res.json().then((comment) => {
        const commentId = comment.filter((c) => c.ticketId === id);
        setCommentsId(commentId.reverse());
      });
    });
  }
  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const savingPromise = new Promise(async (resolve, reject) => {
        const response = await fetch("/api/comment", {
          method: "POST",
          body: JSON.stringify({
            ticketId: id,
            userName: user?.name,
            userImage: user?.image,
            comment,
            numberStar,
          }),
          headers: { "Content-Type": "application/json" },
        });
        if (orderId) {
          const deleteOrderResponse = await fetch("/api/order?_id=" + orderId, {
            method: "DELETE",
          });

          if (deleteOrderResponse.ok) {
            setOrderId("");
          } else {
            console.error("Failed to delete order");
            setIsDeletingOrder(false);
          }
        }
        setComment("");
        setNumberStar(5);
        fetchOrder();
        setExistOrder(false);
        fetchComment();
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
    return daysOfWeek[dayIndex];
  };
  if (loading) return "Loading...";
  return (
    <section className="bg-gray-100">
      <Image
        src={menuItem?.image}
        alt=""
        width={1200}
        height={400}
        className="w-full"
      />
      <div className="flex pt-5 gap-6 pb-12 px-4 bg-white">
        <div className="w-24  flex flex-col items-center justify-center text-center border border-b-[5px] border-gray-300 h-28">
          <div className="w-full bg-primary text-white font-semibold">
            Tháng {date.getMonth() + 1}
          </div>
          <div className="text-6xl text-gray-500">{date.getDate()}</div>
          <div className="text-sm text-gray-500">{getFormattedDay()}</div>
        </div>
        <div className="flex-1">
          <div className="text-3xl font-medium my-4">
            {upperCase(menuItem?.name)}
          </div>
          <div className="flex items-center gap-2 font-medium text-lg my-1">
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
        <div className="w-72">
          <Link
            href={"/order/" + id}
            className="flex py-2 bg-primary text-white font-medium text-xl items-center justify-center"
          >
            Mua vé ngay
          </Link>
          <div className="flex w-full mt-2">
            <div className="flex-1 flex justify-center p-1 border">Chia sẻ</div>
            <div className="flex-1 flex justify-center p-1 border">
              Quan tâm
            </div>
          </div>
          <span className="flex justify-center mt-2 text-gray-400 text-sm">
            --- Người quan tâm
          </span>
        </div>
      </div>
      <div className=" bg-white py-2 flex gap-8 px-8 border text-gray-700 font-medium">
        <a href="#about">Giới thiệu</a>
        <a href="#information">Thông tin vé</a>
        <a href="#organizer">Nhà tổ chức</a>
        <Link href="/menu">Đánh giá</Link>
      </div>
      <div className="flex gap-10 m-4">
        <div className="flex-1">
          <div className="bg-white border-2 border-gray-400 mb-4" id="about">
            <div className="p-3 border-b text-gray-700 font-medium text-lg">
              GIỚI THIỆU
            </div>
            <div className="flex justify-center text-2xl font-medium mt-4">
              {upperCase(menuItem?.name)}
            </div>
            <div className="mx-4 my-2">{menuItem?.description}</div>
            <div className="italic font-medium flex justify-center mb-3">
              Quý Khách sẽ được gửi thông tin số ghế và xác nhận đặt chỗ thành
              công!
            </div>
          </div>
          <div
            className="bg-white border-2 border-gray-400 mb-4"
            id="information"
          >
            <div className="p-3 border-b text-gray-700 font-medium text-lg">
              THÔNG TIN VÉ
            </div>
            {menuItem?.types.length > 0 &&
              menuItem?.types?.map((item, index) => (
                <div
                  className="flex justify-between px-8 py-3 border-b"
                  key={index}
                >
                  <div className="font-light text-lg">{item?.name}</div>
                  <div className="font-medium text-lg mr-8">
                    {item?.price} VND
                  </div>
                </div>
              ))}
          </div>
          <div
            className="bg-white border-2 border-gray-400 mb-4"
            id="organizer"
          >
            <div className="p-3 border-b text-gray-700 font-medium text-lg">
              NHÀ TỔ CHỨC
            </div>
            {menuItem?.managements?.length > 0 &&
              menuItem?.managements?.map((management, index) => (
                <div key={index} className="border-b p-4 flex gap-3">
                  <Image
                    src={"/organizer.jpg"}
                    width={125}
                    height={125}
                    alt=""
                  />
                  <div>
                    <div className="text-2xl font-medium mt-4 mb-2 px-4">
                      {upperCase(management?.name)}
                    </div>
                    <div className=" flex mx-4 gap-2 items-center text-gray-500 font-medium">
                      <Email className="w-4 h-4" />
                      {management?.email}
                    </div>
                    <div className=" flex mx-4 gap-2 items-center text-gray-500 font-medium">
                      <Phone className="w-4 h-4" />
                      {management?.phone}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="w-72 bg-white border-2 border-gray-400 h-fit">
          <div className="py-3 text-2xl font-medium px-4 border-b">
            {upperCase(menuItem?.name)}
          </div>
          <div className="flex flex-col p-4 border-b">
            <div className="flex gap-2 items-center pb-4">
              <Clock className="w-4 h-4" />
              <div className="text-gray-500 font-medium text-sm">
                {menuItem?.time} {getFormattedDay()}, {date.getDate()} Tháng{" "}
                {date.getMonth() + 1} {date.getFullYear()}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Map className="w-4 h-4" />
              <div className="text-gray-500 font-medium text-sm">
                {menuItem?.address}
              </div>
            </div>
          </div>
          <div className="p-4 flex items-center text-base font-medium gap-3 border-b bg-gray-50">
            <Money className="w-4 h-4" />
            From {menuItem?.price} VND
          </div>
          <Link
            href={"/order/" + id}
            className="flex py-2 bg-primary text-white font-medium text-xl items-center justify-center"
          >
            Mua vé ngay
          </Link>
          <div className="flex w-full mt-2">
            <div className="flex-1 flex justify-center p-1 border">Chia sẻ</div>
            <div className="flex-1 flex justify-center p-1 border">
              Quan tâm
            </div>
          </div>
        </div>
      </div>
      <div>
        {!isOpen && (
          <div className="flex gap-2 p-3 border-b text-gray-700 font-medium text-lg items-center">
            <div onClick={() => setIsOpen((pr) => !pr)}>
              <ChevronDown />
            </div>
            ĐÁNH GIÁ ({commentsId?.length})
          </div>
        )}
        {isOpen && (
          <>
            <div className="flex gap-2 p-3 border-b text-gray-700 font-medium text-lg items-center">
              <div onClick={() => setIsOpen((pr) => !pr)}>
                <ChevronUp />
              </div>
              ĐÁNH GIÁ ({commentsId?.length})
            </div>
            <div>
              {existOrder && (
                <div className="bg-white px-8 py-6">
                  <div className="flex gap-3 items-center">
                    <Image
                      src={"/user_icon.png"}
                      alt=""
                      width={35}
                      height={35}
                      className="rounded-full"
                    />
                    <div className="font-medium text-lg">Phú Huy</div>
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
                      onClick={(e) => handleFormSubmit(e)}
                    >
                      Gửi
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div>
              {commentsId?.length > 0 &&
                commentsId.map((c, i) => (
                  <div key={i} className="bg-white px-8 py-6">
                    <div className="flex gap-3 items-center">
                      <Image
                        src={c.userImage}
                        alt=""
                        width={35}
                        height={35}
                        className="rounded-full"
                      />
                      <div className="font-medium text-lg">{c.userName}</div>
                    </div>
                    <div className="text-gray-600 mt-4 mb-2">{c.comment}</div>
                    <NumberStar number={c.numberStar} />
                    <div className="font-light text-gray-400 text-xs mt-2">
                      {getTimeAgo(new Date(c.createdAt))}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
