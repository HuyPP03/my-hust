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
import NumberStar from "@/libs/numberStar";
import getTimeAgo from "@/libs/getTimeAgo";
import Right from "@/components/Icons/Right";
import Close from "@/components/Icons/Close";

export default function OrderPage() {
  const { id } = useParams();
  const { data: session, status, update } = useSession();
  const [menuItem, setMenuItem] = useState(null);
  const [sum, setSum] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [commentsId, setCommentsId] = useState([]);
  const [commentFives, setCommentFives] = useState([]);

  const date = new Date(menuItem?.date);
  const currentDate = new Date();
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
    if (menuItem) {
      const sum = menuItem.types.reduce((sum, type) => {
        return sum + Number(type.quantity);
      }, 0);
      setSum(sum);
    }
  }, [menuItem]);
  function fetchComment() {
    fetch("/api/comment").then((res) => {
      res.json().then((comment) => {
        let commentId = comment.filter((c) => c.ticketId === id);
        commentId = commentId.reverse();
        setCommentsId(commentId);
        setCommentFives(commentId.slice(0, 5));
      });
    });
  }
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
  const getFormattedMonth = () => {
    const date = new Date(menuItem?.date);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthIndex = date?.getMonth();
    return months[monthIndex];
  };
  if (loading) return "Loading...";
  return (
    <section className="bg-gray-100 relative">
      {isOpen && (
        <div className="fixed h-screen bg-black/50 w-screen left-0 top-0 z-[9999]  flex justify-center items-center">
          <div className="w-[600px] bg-white my-20 max-h-[650px] rounded-3xl overflow-hidden">
            <div className="flex flex-col gap-3 justify-end rounded-tr-3xl overflow-hidden sticky">
              <div
                className="bg-primary w-fit flex px-3 py-1 text-white h-fit cursor-pointer items-end ml-auto"
                onClick={() => setIsOpen(false)}
              >
                <span>Close</span>
                <Close />
              </div>
              <div className="text-2xl text-gray-700 font-semibold mb-4 ml-6">
                Comment
              </div>
            </div>
            <div className="ml-6 my-1 overflow-y-scroll h-[550px]">
              {commentsId?.length > 0 &&
                commentsId.map((c, i) => (
                  <div key={i} className="bg-white px-4 py-6">
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
          </div>
        </div>
      )}
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
          {getFormattedMonth()}
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
            {getFormattedDay()}, {date.getDate()}{"/"}{date.getMonth() + 1}{"/"}
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
          {currentDate < date ? (
            sum > 0 ? (
              <Link
                href={"/order/" + id}
                className="flex py-4 bg-primary text-white font-medium text-2xl items-center justify-center"
              >
                ORDER NOW
              </Link>
            ) : (
              <div className="flex py-4 bg-primary text-white font-medium text-2xl items-center justify-center">
                SOLD OUT
              </div>
            )
          ) : (
            <div className="flex py-4 bg-primary text-white font-medium text-2xl items-center justify-center">
               END
            </div>
          )}
        </div>
      </div>
      <div className=" bg-white py-2 flex gap-8 px-8 border text-gray-700 font-medium">
        <a href="#about">Introduction</a>
        <a href="#information">Ticket</a>
        <a href="#organizer">Management</a>
        <Link href="#comment">Comment</Link>
      </div>
      <div className="flex gap-10 m-4">
        <div className="flex-1">
          <div className="bg-white border-2 border-gray-400 mb-4" id="about">
            <div className="p-3 border-b text-gray-700 font-medium text-lg">
            INTRODUCTION
            </div>
            <div className="flex justify-center text-2xl font-medium mt-4">
            </div>
            <div className="mx-4 my-2">{menuItem?.description}</div>
            <div className="italic font-medium flex justify-center mb-3">
            After successful payment, we will send the QR code of the tickets to your register email!
            </div>
          </div>
          <div
            className="bg-white border-2 border-gray-400 mb-4"
            id="information"
          >
            <div className="p-3 border-b text-gray-700 font-medium text-lg">
              TICKET INFORMATION
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
              MANAGEMENT
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
        </div>
      </div>
      <div>
        {
          <>
            <div
              className="flex justify-between gap-2 p-5 border-b text-gray-700 font-medium text-lg items-center mr-[320px]"
              id="comment"
            >
              <div>COMMENT ({commentsId?.length})</div>
              <div
                className="hover:underline text-primary text-sm flex gap-1 items-center cursor-pointer"
                onClick={() => setIsOpen(true)}
              >
                More
                <Right className="w-4 h-4" />
              </div>
            </div>
            <div>
              {commentFives?.length > 0 &&
                commentFives.map((c, i) => (
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
        }
      </div>
    </section>
  );
}
