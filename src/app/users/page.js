"use client";

import Close from "@/components/Icons/Close";
import Search from "@/components/Icons/Search";
import { useProfile } from "@/components/Layout/UseProfile";
import UserTabs from "@/components/Layout/UserTabs";
import upperCase from "@/libs/upperCase";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const { loading, data } = useProfile();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/users").then((res) => {
      res.json().then((users) => {
        setUsersData(users);
        setUsers(users);
      });
    });
  }, []);
  useEffect(() => {
    if (search === "") setUsers(usersData);
    else {
      const data = usersData.filter((u) => {
        return (
          upperCase(u.email).includes(upperCase(search)) ||
          upperCase(u.name).includes(upperCase(search))
        );
      });
      setUsers(data);
    }
  }, [search]);
  if (loading) return "Loading user info...";
  if (!data?.admin) return "Not an admin";
  return (
    <section className="mt-8 mx-auto max-w-2xl">
      <UserTabs isAdmin={data.admin} />
      <div className="relative">
        <input
          type="text"
          className="mt-8 outline-none border-0"
          placeholder="Enter name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search === "" && (
          <div className="absolute text-slate-800 top-[2px] right-[1px] px-4 py-2 cursor-pointer">
            <Search className="w-5 h-5" />
          </div>
        )}
        {search !== "" && (
          <div
            className="absolute text-slate-800 top-[2px] right-[2px] px-4 py-2 cursor-pointer"
            onClick={() => setSearch("")}
          >
            <Close />
          </div>
        )}
      </div>
      <h1 className="text-center text-primary text-4xl pt-10 font-semibold italic p-4">
        Existing users
      </h1>
      <div className="mt-8">
        {users?.length > 0 &&
          users.map((user) => (
            <div
              key={user._id}
              className="bg-gray-200 rounded-lg mb-2 p-1 px-4 flex items-center gap-4"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 grow">
                <div className="text-gray-700 font-semibold">
                  {!!user.name && <span>{user.name}</span>}
                  {!user.name && <span className="italic">No name</span>}
                </div>
                <span className="text-gray-500">{user.email}</span>
              </div>
              <div>
                <Link className="button" href={"/users/edit/" + user._id}>
                  Edit
                </Link>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
