import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useProfile } from "@/components/Layout/UseProfile";
import UserTabs from "@/components/Layout/UserTabs";
import React from "react";
import Link from "next/link";
import Left from "@/components/Icons/Left";
import { redirect, useParams } from "next/navigation";
import MenuItemForm from "@/components/Layout/MenuItemForm";
import DeleteButton from "@/components/Layout/DeleteButton";
import Close from "@/components/Icons/Close";

export default function EditMenuItemPage() {
  const { id } = useParams();
  const { loading, data } = useProfile();
  const [menuItem, setMenuItem] = useState(null);
  const [orders, setOrders] = useState([]);
  const [types, setTypes] = useState([]);
  const [quantity, setQuantity] = useState(0);

  const [redirectToItems, setRedirectToItems] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sumAndDiscount, setSumAndDiscount] = useState({ sum: 0, discount: 0 });

  useEffect(() => {
    fetch("/api/menu-items").then((res) => {
      res.json().then((items) => {
        const item = items.find((i) => i._id === id);
        setMenuItem(item);
      });
    });
    fetch("/api/order").then((res) => {
      res.json().then((items) => {
        const orders = items.filter((i) => i.ticketId === id);
        setOrders(orders);
      });
    });
  }, []);
  console.log(orders);
  async function handleFormSubmit(e, data) {
    e.preventDefault();
    try {
      data = { ...data, _id: id };
      const savingPromise = new Promise(async (resolve, reject) => {
        const response = await fetch("/api/menu-items", {
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
        const response = await fetch("/api/menu-items?_id=" + id, {
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
  function handleClick() {
    const typesArray = menuItem.types.map((type) => ({ ...type, quantity: 0 }));
    orders.forEach((order) => {
      const orderTypes = order.cartProducts;
      setSumAndDiscount((prev) => {
        return {
          ...prev,
          sum: prev.sum + order.sum,
          discount: prev.discount + order.discount,
        };
      });
      orderTypes.forEach((orderType) => {
        const foundType = typesArray.find(
          (type) => type.name === orderType.name
        );
        if (foundType) {
          foundType.quantity += orderType.quantity;
        }
      });
    });
    setTypes(typesArray);
    setQuantity(() => {
      let quantity = 0;
      typesArray.forEach((t) => {
        quantity += t.quantity;
      });
      return quantity;
    });
  }
  console.log(sumAndDiscount);
  if (redirectToItems) {
    return redirect("/menu-items");
  }
  if (loading) return "Loading user profile...";
  if (!data?.admin) return "Not an admin.";
  return (
    <section className="mt-8">
      {isOpen && (
        <div className="fixed h-screen bg-black/50 w-screen left-0 top-0 z-[9999]  flex justify-center items-center">
          <div className="w-[600px] bg-white my-20 max-h-[650px] rounded-3xl overflow-hidden">
            <div className="flex flex-col gap-3 justify-end rounded-tr-3xl overflow-hidden sticky">
              <div
                className="bg-primary w-fit flex px-3 py-1 text-white h-fit cursor-pointer items-end ml-auto"
                onClick={() => {
                  setIsOpen(false);
                  setSumAndDiscount({ sum: 0, discount: 0 });
                }}
              >
                <span>Close</span>
                <Close />
              </div>
              <div className="text-2xl text-gray-700 font-semibold mb-4 ml-6">
                Statistics
              </div>
            </div>
            <div className="ml-6 my-1 overflow-y-scroll max-h-[550px]">
              {types.length > 0 && (
                <div>
                  <div className="pb-8 pt-4 text-gray-500 font-medium grid grid-cols-2">
                    <div>Ticket Type</div>
                    <div className="flex justify-end">Quantity</div>
                  </div>
                  {types.map((o, index) => (
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
                  <div className="text-gray-500 font-medium text-lg">
                    Total tickets sold: {quantity}
                  </div>
                  <div className="text-gray-500 font-medium text-lg">
                    Initial total amount: {sumAndDiscount.sum}
                  </div>
                  <div className="text-gray-500 font-medium text-lg mb-8">
                    Total discount amount: {sumAndDiscount.discount}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <UserTabs isAdmin={data.admin} />
      <div className="mt-8 max-w-2xl mx-auto">
        <Link className="button" href={"/menu-items"}>
          <Left />
          <span>Show all concerts</span>
        </Link>
      </div>
      <h1 className="text-center text-primary text-4xl pt-10 font-semibold italic p-4">
        Edit concert
      </h1>
      {menuItem && (
        <>
          <MenuItemForm onSubmit={handleFormSubmit} menuItem={menuItem} />
          <div className="max-w-2xl mx-auto mt-4">
            <div className="max-w-[458px] ml-auto">
              <DeleteButton
                label={"Delete this ticket"}
                onDelete={handleDeleteClick}
              />
              <button
                className="mt-4"
                onClick={() => {
                  setIsOpen(true);
                  handleClick();
                }}
              >
                Revenue Statistics
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
