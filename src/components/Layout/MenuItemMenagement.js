"use client";

import Trash from "../Icons/Trash";
import Plus from "../Icons/Plus";
import ChevronDown from "../Icons/ChevronDown";
import { useState } from "react";
import ChevronUp from "../Icons/ChevronUp";

export default function MenuItemMenagement({
  name,
  addLabel,
  props,
  setProps,
}) {
  const [isOpen, setIsOpen] = useState(false);
  function addProp() {
    setProps((oldProps) => {
      return [...oldProps, { name: "", phone: "", email: "" }];
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
            <div
              key={index}
              className="flex flex-col border-b-2 border-b-slate-400 mt-2"
            >
              <div className="grow">
                <label>Management name</label>
                <input
                  type="text"
                  placeholder="Management name"
                  value={type.name}
                  onChange={(e) => editProp(e, index, "name")}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label>Phone</label>
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={type.phone}
                    onChange={(e) => editProp(e, index, "phone")}
                  />
                </div>
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={type.email}
                    onChange={(e) => editProp(e, index, "email")}
                  />
                </div>
              </div>
              <div>
                <button
                  className="bg-white mb-4 px-2"
                  type="button"
                  onClick={() => removeProp(index)}
                >
                  <Trash />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        <button
          type="button"
          className="bg-white items-center mt-4"
          onClick={addProp}
        >
          <Plus className="w-5 h-5" />
          <span>{addLabel}</span>
        </button>
      </div>
    </div>
  );
}
