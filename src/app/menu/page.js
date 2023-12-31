"use client"
import { useEffect, useState } from "react";
import Close from "@/components/Icons/Close";
import Search from "@/components/Icons/Search";
import MenuItemInMenu from "@/components/Menu/MenuItemInMenu";
import upperCase from "@/libs/upperCase";
import Link from "next/link";
import isEqual from 'lodash/isEqual';
import { UserIcon } from '@heroicons/react';
import Fuse from "fuse.js";

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [menu, setMenu] = useState([]);
  const [menuItemsRender, setMenuItemsRender] = useState([]);
  const [count, setCount] = useState(7);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState({
    start: "",
    end: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState({
    min: "",
    max: "",
  });
  const oriPrice = { min: "", max: "" };
  const [selectedAddress, setSelectedAddress] = useState("");
  const addresses = [
    'Hoàng Mai', 'Long Biên', 'Thanh Xuân', 'Bắc Từ Liêm', 'Ba Đình',
    'Cầu Giấy', 'Đống Đa', 'Hai Bà Trưng', 'Hoàn Kiếm', 'Hà Đông',
    'Tây Hồ', 'Nam Từ Liêm'
  ];

  const priceRanges = [
    { label: 'All', min: 0, max: Infinity },
    { label: '0 - 150,000', min: 0, max: 150000 },
    { label: '150,000 - 300,000', min: 150000, max: 300000 },
    { label: '300,000 - 500,000', min: 300000, max: 500000 },
    { label: '500,000+', min: 500000, max: Infinity },
  ];

  const [searchResults, setSearchResults] = useState([]);




  const applyFilters = () => {
    let filteredMenuItems = [...searchResults];

    if (selectedDate.start !== "" && selectedDate.end !== "") {
      filteredMenuItems = filteredMenuItems.filter((item) => {
        const itemDate = new Date(item.date);
        return (
          itemDate >= new Date(selectedDate.start) &&
          itemDate <= new Date(selectedDate.end)
        );
      });
    }

    if (selectedCategory !== "" && selectedCategory !== "All") {
      filteredMenuItems = filteredMenuItems.filter((item) =>
        item.categories.some(
          (category) => category.category === selectedCategory
        )
      );
    }

    if (!isEqual(selectedPrice, oriPrice)) {
      filteredMenuItems = filteredMenuItems.filter((item) =>
        item.price >= selectedPrice.min && item.price <= selectedPrice.max
      );
    }

    if (selectedAddress !== "" && selectedAddress !== "All") {
      filteredMenuItems = filteredMenuItems.filter((item) => {
        return (
          item.address === selectedAddress
        );
      });
    }

    setMenuItemsRender(filteredMenuItems);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedDate, selectedCategory, selectedPrice, selectedAddress]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesResponse = await fetch("/api/categories");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        const menuItemsResponse = await fetch("/api/menu-items");
        const menuItemsData = await menuItemsResponse.json();
        const reversedMenuItems = menuItemsData.reverse();
        setMenu(reversedMenuItems);
        setSearchResults(reversedMenuItems);
        setLoading(false);

        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        const searchTerm = params.get("search");
        setSearch(searchTerm);

        if (searchTerm && searchTerm !== "") {
          const transformedItems = reversedMenuItems.map((item) => ({
            ...item,
            artistName: item.artists.map((artist) => artist.name).join(" "), // Chuyển đổi mảng nghệ sĩ thành một chuỗi
          }));


          const fuse = new Fuse(transformedItems, {
            keys: ["name", "artistName"], // Specify the properties to search
          });
      
          const result = fuse.search(searchTerm);
      
          setSearchResults(result.map((item) => item.item));
          setCount(7);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (searchResults.length > count) {
      setMenuItemsRender(searchResults.slice(0, count));
    } else setMenuItemsRender(searchResults);
  }, [count, searchResults]);

  const handleClearSearch = () => {
    setSearch("");
    setSearchResults(menu);
    setCount(7);
  };

  if (loading) return "Loading...";

  return (
    <section>
      <div className="relative isolate overflow-hidden bg-slate-600 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Everything is better with a Song
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-300">
                Concerts will bring you a feeling of comfort and relaxation
                after working days.
              </p>
              <form className="flex max-w-2xl gap-x-4 items-center mt-8 relative">
        <input
          id="search"
          name="search"
          type="text"
          autoComplete="search"
          required
          className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-white/10 mb-0 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 pl-4"
          placeholder="Search"
          value={search || ""}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search === "" && (
          <div className="flex-none rounded-md text-sm font-semibold shadow-sm w-auto mb-4 absolute right-3 text-gray-500">
            <Search className="h-5 w-5" />
          </div>
        )}
        {search !== "" && (
          <>
            <Link
              href={"/menu"}
              className="flex-none rounded-md text-sm font-semibold shadow-sm w-auto mb-4 absolute right-2"
              onClick={handleClearSearch}
            >
              <Close />
            </Link>
          </>
        )}
      </form>
            </div>
          </div>
        </div>
        <div
          className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
          aria-hidden="true"
        >
          <div
            className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>
      <div className="mt-8 space-y-6">
  <div className="flex flex-wrap gap-10">
    <div className="flex-1">
      <label htmlFor="Date" className="block text-sm font-medium text-gray-500 mb-1">
        Date:
      </label>
      <div className="flex gap-2">
        <input
          type="date"
          id="StartDate"
          className="p-2 border border-gray-300 rounded-md flex-1"
          value={selectedDate.start}
          onChange={(e) =>
            setSelectedDate((prev) => ({ ...prev, start: e.target.value }))
          }
        />
        <span className="mx mt-3">-</span>
        <input
          type="date"
          id="EndDate"
          className="p-2 border border-gray-300 rounded-md flex-1"
          value={selectedDate.end}
          onChange={(e) =>
            setSelectedDate((prev) => ({ ...prev, end: e.target.value }))
          }
        />
      </div>
    </div>

    <div className="flex-1">
      <label htmlFor="price" className="block text-sm font-medium text-gray-500 mb-1">
        Price:
      </label>
      <select
        id="price"
        className="mt-1 p-2 border border-gray-300 rounded-md flex-1"
        value={selectedPrice.label}
        onChange={(e) => {
          const selectedRange = priceRanges.find(
            (range) => range.label === e.target.value
          );
          setSelectedPrice(selectedRange);
        }}
      >
        {priceRanges.map((range) => (
          <option key={range.label} value={range.label}>
            {range.label}
          </option>
        ))}
      </select>
    </div>

    <div className="flex-1">
      <label htmlFor="category" className="block text-sm font-medium text-gray-500 mb-1">
        Existing Categories:
      </label>
      <select
        id="category"
        className="mt-1 p-2 border border-gray-300 rounded-md flex-1"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="All">All</option>
        {categories.map((category) => (
          <option key={category._id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>

    <div className="flex-1">
      <label htmlFor="address" className="block text-sm font-medium text-gray-500 mb-1">
        Address:
      </label>
      <select
        id="address"
        className="mt-1 p-2 border border-gray-300 rounded-md flex-1"
        value={selectedAddress}
        onChange={(e) => setSelectedAddress(e.target.value)}
      >
        <option value="All">All</option>
        {addresses.map((address) => (
          <option key={address} value={address}>
            {address}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>

      {menuItemsRender.length === 0 && (
        <>
          <h1 className="mt-8 text-gray-600 flex justify-center font-semibold text-4xl">
            Oops sorry! Results not found
          </h1>
          <h4 className="flex justify-center max-w-2xl mx-auto mt-4">
            You can adjust your filters, try using different keywords or explore
            more hot events below.
          </h4>
        </>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {menuItemsRender.length > 0 &&
          menuItemsRender.map((item, index) => (
            <MenuItemInMenu key={item._id} {...item} index={index} />
          ))}
      </div>

      {menuItemsRender.length > count && (
        <div className="flex items-center justify-center py-6">
          <div
            onClick={() => setCount(count + 7)}
            className="bg-primary text-white py-2 px-4 rounded-full cursor-pointer"
          >
            More events...
          </div>
        </div>
      )}
    </section>
  );
}