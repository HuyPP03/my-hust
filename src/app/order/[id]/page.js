"use client";

import Clock from "@/components/Icons/Clock";
import Map from "@/components/Icons/Map";
import Plus from "@/components/Icons/Plus";
import Sub from "@/components/Icons/Sub";
import upperCase from "@/libs/upperCase";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/app/Providers";
export default function OrderPage() {
  const { id } = useParams();
  const { cartProducts } = useContext(CartContext);
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState([]);
  const [orderItem, setOrderItem] = useState(cartProducts);
  const [sum, setSum] = useState(0);
  const { addToCart } = useContext(CartContext);
  const date = new Date(menuItem?.date);
  useEffect(() => {
    setLoading(true);
    fetch("/api/menu-items").then((res) => {
      res.json().then((items) => {
        const item = items.find((i) => i._id === id);
        setMenuItem(item);
        setLoading(false);
        if (item?.types?.length > 0) {
          for (let i = 0; i < item.types.length; i++) {
            setOrder((prev) => {
              if (prev?.length < item.types.length) {
                return [
                  ...prev,
                  {
                    name: item.types[i].name,
                    quantity: 0,
                    price: item.types[i].price,
                    sum: item.types[i].quantity,
                  },
                ];
              } else return prev;
            });
          }
        }
      });
    });
  }, []);
  const handleQuantityChange = (index, increment, quantity) => {
    setOrder((prevOrder) => {
      const updatedOrder = [...prevOrder];
      if (increment < 0 && updatedOrder[index].quantity === 0)
        return updatedOrder;
      if (increment > 0 && updatedOrder[index].quantity === quantity) {
        return updatedOrder;
      }
      updatedOrder[index].quantity += increment;
      return updatedOrder;
    });
  };
  useEffect(() => {
    setOrderItem(order.filter((o) => o.quantity > 0));
  }, [order]);
  useEffect(() => {
    // Tính tổng giá trị từ orderItem
    const total = orderItem.reduce((acc, item) => {
      return acc + item.quantity * item.price;
    }, 0);
    addToCart(orderItem);
    // Cập nhật giá trị của sum
    setSum(total);
  }, [orderItem]);

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
        <div className="flex justify-center border py-2 font-semibold text-green-600">
          Chọn vé
        </div>
        <div className="flex justify-center border py-2 text-gray-600 font-medium">
          Thanh toán
        </div>
        <div className="flex justify-center border py-2 text-gray-600 font-medium">
          Hoàn tất
        </div>
      </div>
      <div className="flex mt-8 ml-8 gap-8">
        <div className="flex-1">
          <div className="border-b-4 pb-2 pt-4 grid grid-cols-4 font-medium text-gray-600">
            <div className="col-span-2">LOẠI VÉ</div>
            <div className="flex justify-end">GIÁ VÉ</div>
            <div className="flex justify-end">SỐ LƯỢNG</div>
          </div>
          {menuItem?.types.length > 0 &&
            menuItem?.types.map((type, index) => (
              <div
                key={index}
                className="py-6 grid grid-cols-4 border-b border-dashed"
              >
                <div className="col-span-2 flex items-start flex-col">
                  {type?.name}
                  {type?.quantity <= 0 && (
                    <span className="text-primary font-semibold text-bg">
                      Hết vé
                    </span>
                  )}
                  {order[index]?.quantity === type?.quantity &&
                    type?.quantity > 0 && (
                      <span className="text-primary font-semibold text-bg">
                        Đã đến số lượng tối đa
                      </span>
                    )}
                </div>
                <div className="flex justify-end items-center">
                  {type?.price} VND
                </div>
                <div className="flex justify-end items-center">
                  <div
                    className={`flex border-2 ${
                      type?.quantity <= 0 ? "bg-gray-400" : ""
                    }`}
                  >
                    <div
                      className="px-3 py-1 flex items-center cursor-pointer"
                      onClick={() => {
                        if (type?.quantity > 0) {
                          handleQuantityChange(index, -0.5, type.quantity);
                        }
                      }}
                    >
                      <Sub className="w-4 h-4" />
                    </div>
                    <div className="px-3 py-1 border-x-2">
                      {order[index]?.quantity}
                    </div>
                    <div
                      className="px-3 py-1 flex items-center cursor-pointer"
                      onClick={() => {
                        if (type?.quantity > 0) {
                          handleQuantityChange(index, 0.5, type.quantity);
                        }
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div>
          <div>
            <div className="w-80 bg-white px-6">
              <div className="pb-2 pt-4 border-b-4 font-semibold text-gray-700">
                THÔNG TIN ĐẶT VÉ
              </div>
              {orderItem.length > 0 && (
                <div>
                  <div className="pb-8 pt-4 text-gray-500 font-medium grid grid-cols-2">
                    <div>Loại vé</div>
                    <div className="flex justify-end">Số lượng</div>
                  </div>
                  {orderItem.map((o, index) => (
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
              {orderItem.length === 0 && (
                <div className="pb-8 pt-4 text-gray-500 text-sm">
                  Vui lòng chọn vé...
                </div>
              )}
            </div>
            <div className="flex justify-between bg-orange-900 text-white px-6 py-4 font-medium">
              <div>Tổng cộng</div>
              <div>{sum} VND</div>
            </div>
          </div>
          <Link
            href={
              orderItem.length > 0 ? "/order/" + id + "/step2" : "/order/" + id
            }
            className="mt-8 p-4 flex justify-center bg-green-600 text-white font-semibold text-lg"
          >
            Tiếp tục
          </Link>
        </div>
      </div>
    </section>
  );
}
