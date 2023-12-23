"use client";

import { useEffect, useState } from "react";
import MenuItem from "../Menu/MenuItem";
import Link from "next/link";
export const HomeMenu = () => {
  const [lastestTickets, setLastestTickets] = useState([]);
  useEffect(() => {
    fetch("/api/menu-items").then((res) => {
      res.json().then((menuItems) => {
        const lastestTickets = menuItems.slice(-5);
        setLastestTickets(lastestTickets);
      });
    });
  }, []);

  return (
    <section>
      <div className="text-center">
        <h3 className="uppercase text-gray-500 font-semibold leading-4">
          Check out
        </h3>
        <h2 className="text-primary font-bold text-4xl italic pb-4">
          Featured events
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {lastestTickets.length > 0 &&
          lastestTickets.map((ticket) => (
            <MenuItem key={ticket._id} {...ticket} />
          ))}
      </div>
      <div className="flex items-center justify-center py-8">
        <Link
          href="/menu"
          className="items-center bg-primary rounded-full text-white text- px-12 py-3 font-semibold"
        >
          More events...
        </Link>
      </div>
    </section>
  );
};
