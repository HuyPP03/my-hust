"use client";

import Trash from "../Icons/Trash";
import Plus from "../Icons/Plus";
import ChevronDown from "../Icons/ChevronDown";
import { useState } from "react";
import ChevronUp from "../Icons/ChevronUp";

export default function MenuItemPriceProps({
  name,
  addLabel,
  props,
  setProps,
}) {
  const [isOpen, setIsOpen] = useState(false);
  function addProp() {
    setProps((oldProps) => {
      return [...oldProps, { name: "", price: 0, quantity: 0 }];
    });
  }

  function editProp(e, index, prop) {
    const newValue = e.target.value;
    setProps((prevTypes) => {
      const newTypes = [...prevTypes];
      newTypes[index][prop] = newValue;
      return newTypes;
    });
  }

  function removeProp(indexToRemove) {
    setProps((prev) => prev.filter((v, index) => index !== indexToRemove));
  }
  return (
    <div className="bg-gray-300 p-2 rounded-md mb-2">
      <button
        type="button"
        className="inline-flex p-1 justify-start"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen && <ChevronUp />}
        {!isOpen && <ChevronDown />}
        <span className="text-gray-700">{name}</span>
        <span>({props?.length})</span>
      </button>

      <div className={isOpen ? "block" : "hidden"}>
        {props?.length > 0 &&
          props.map((type, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div>
                <label>Type name</label>
                <input
                  type="text"
                  placeholder="Type name"
                  value={type.name}
                  onChange={(e) => editProp(e, index, "name")}
                />
              </div>
              <div>
                <label>Price</label>
                <input
                  type="text"
                  placeholder="Extra price"
                  value={type.price}
                  onChange={(e) => editProp(e, index, "price")}
                />
              </div>
              <div>
                <label>Quantity</label>
                <input
                  type="text"
                  placeholder="Quantity"
                  value={type.quantity}
                  onChange={(e) => editProp(e, index, "quantity")}
                />
              </div>
              <div>
                <button
                  className="bg-white mb-4 px-2"
                  type="button"
                  onClick={() => removeProp(index)}
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))}
        <button
          type="button"
          className="bg-white items-center"
          onClick={addProp}
        >
          <Plus className="w-5 h-5" />
          <span>{addLabel}</span>
        </button>
      </div>
    </div>
  );
}
