"use client";

import { useEffect, useState } from "react";
import EditableImage from "./EditableImage";
import MenuItemPriceProps from "./MenuItemPriceProps";
import MenuItemArtist from "./MenuItemArtist";
import MenuItemMenagement from "./MenuItemMenagement";
import DatePage from "@/libs/date";
import MenuItemCategories from "./MenuItemCategories";

export default function MenuItemForm({ onSubmit, menuItem }) {
  const [image, setImage] = useState(menuItem?.image || "/concert.jpg");
  const [name, setName] = useState(menuItem?.name || "");
  const [description, setDescription] = useState(menuItem?.description || "");
  const [price, setPrice] = useState(menuItem?.price || "");
  const [address, setAddress] = useState(menuItem?.address || "");
  const [date, setDate] = useState(menuItem?.date || "");
  const [time, setTime] = useState(menuItem?.time || "");
  const [types, setTypes] = useState(menuItem?.types || []);
  const [artists, setArtists] = useState(menuItem?.artists || []);
  const [managements, setManagements] = useState(menuItem?.managements || []);
  const [categories, setCategories] = useState(menuItem?.categories || []);
  const [showConfirm, setShowConfirm] = useState(false);
  if (showConfirm) {
    return (
      <div className="fixed bg-slate-200/60 inset-0 flex items-center h-full justify-center">
        <div className="bg-white p-4 rounded-lg">
          <div>Are you sure you want to create or update?</div>
          <div className="flex gap-2 mt-1">
            <button type="button" onClick={() => setShowConfirm(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="primary"
              onClick={(e) => {
                onSubmit(e, {
                  image,
                  name,
                  description,
                  price,
                  types,
                  artists,
                  managements,
                  categories,
                  address,
                  date,
                  time,
                });
                // setShowConfirm(false);
              }}
            >
              Yes,&nbsp;save!
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <section>
      <form
        className="max-w-2xl mx-auto"
        onSubmit={(e) => {
          onSubmit(e, {
            image,
            name,
            description,
            price,
            types,
            artists,
            managements,
            categories,
            address,
            date,
            time,
          });
        }}
      >
        <div
          className="md:grid items-start gap-4"
          style={{ gridTemplateColumns: ".3fr .7fr" }}
        >
          <div>
            <EditableImage link={image} setLink={setImage} />
          </div>
          <div className="grow">
            <label>Ticket name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></input>
            <div className="grid grid-cols-2 gap-2">
              {/* <div>
                <label>Categories</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories?.length > 0 &&
                    categories.map((c) => (
                      <option value={c._id} key={c._id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div> */}
              <div>
                <label>Base price</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label>Event date</label>
                <input
                  type="date"
                  onChange={(e) => setDate(e.target.value)}
                ></input>
              </div>
              <div>
                <label>Current date</label>
                <input
                  type="text"
                  value={DatePage(date)}
                  disabled={true}
                ></input>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label>Event time</label>
                <input
                  type="time"
                  onChange={(e) => setTime(e.target.value)}
                ></input>
              </div>
              <div>
                <label>Current time</label>
                <input type="text" value={time} disabled={true}></input>
              </div>
            </div>
            <div>
              <label>Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></input>
            </div>
            <MenuItemPriceProps
              name={"Ticket type"}
              addLabel={"Add Ticket type"}
              props={types}
              setProps={setTypes}
            />
            <MenuItemArtist
              name={"Names of artists"}
              addLabel={"Artist"}
              props={artists}
              setProps={setArtists}
            />
            <MenuItemMenagement
              name={"Names of managements"}
              addLabel={"Management"}
              props={managements}
              setProps={setManagements}
            />
            <MenuItemCategories
              name={"Categories"}
              addLabel={"Category"}
              props={categories}
              setProps={setCategories}
            />
            <button type="submit">Save</button>
          </div>
        </div>
      </form>
    </section>
  );
}
