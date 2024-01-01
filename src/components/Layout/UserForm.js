"use client";

import { useState } from "react";
import EditableImage from "./EditableImage";
import { useProfile } from "./UseProfile";

export default function UserForm({ user, onSave, myself = false }) {
  const [userName, setUserName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [admin, setAdmin] = useState(user?.admin || false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: loggedInUserData } = useProfile();

  if (showConfirm) {
    return (
      <div className="fixed bg-slate-200/60 inset-0 flex items-center h-screen w-screen justify-center">
        <div className="bg-white p-4 rounded-lg">
          <div>Are you sure you want to save?</div>
          <div className="flex gap-2 mt-1">
            <button type="button" onClick={() => setShowConfirm(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="primary"
              onClick={(e) => {
                onSave(e, { name: userName, image, phone, address, admin });
                setShowConfirm(false);
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
    <div
      className="md:grid items-start gap-4"
      style={{ gridTemplateColumns: ".35fr .65fr" }}
    >
      <div>
        <EditableImage link={image} setLink={setImage} />
      </div>
      <form className="grow" onSubmit={(e) => setShowConfirm(true)}>
        <label>Full name</label>
        <input
          type="text"
          placeholder="Full name"
          value={userName}
          disabled={myself}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        ></input>
        <label>Email</label>
        <input
          type="email"
          placeholder="Email"
          disabled={true}
          value={user?.email}
        />
        <label>Phone number</label>
        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          disabled={myself}
          onChange={(e) => setPhone(e.target.value)}
        />
        <label>Address</label>
        <input
          type="text"
          placeholder="Address"
          value={address}
          disabled={myself}
          onChange={(e) => setAddress(e.target.value)}
        />
        {loggedInUserData.admin && (
          <div>
            <label
              className="p-2 inline-flex items-center gap-2 mb-4"
              htmlFor="adminCb"
            >
              <input
                id="adminCb"
                type="checkbox"
                className=""
                value={"1"}
                checked={admin}
                onChange={(e) => setAdmin(e.target.checked)}
              />
              <span>Admin</span>
            </label>
          </div>
        )}
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
