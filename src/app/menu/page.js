"use client";

import Close from "@/components/Icons/Close";
import Search from "@/components/Icons/Search";
import MenuItemInMenu from "@/components/Menu/MenuItemInMenu";
import upperCase from "@/libs/upperCase";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [menu, setMenu] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [menuItemsRender, setMenuItemsRender] = useState([]);
  const [count, setCount] = useState(7);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch categories
        const categoriesResponse = await fetch("/api/categories");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch menu items
        const menuItemsResponse = await fetch("/api/menu-items");
        const menuItemsData = await menuItemsResponse.json();
        const reversedMenuItems = menuItemsData.reverse();
        setMenu(reversedMenuItems);
        setMenuItems(reversedMenuItems);
        setLoading(false);
        // After fetching data, get search term from URL
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        const searchTerm = params.get("search");
        setSearch(searchTerm);
        // Process search term or perform other actions with the data
        searchMenu(searchTerm, reversedMenuItems);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    fetchData();
  }, []);
  function searchMenu(searchTerm, reversedMenuItems) {
    if (searchTerm && searchTerm !== "") {
      const data = reversedMenuItems.filter((i) => {
        return upperCase(i.name).includes(upperCase(searchTerm));
      });
      setMenuItems(data);
    } else {
      setMenuItems(menu);
      console.log(menuItems);
    }
    setCount(7);
  }
  useEffect(() => {
    if (menuItems.length > count) {
      setMenuItemsRender(menuItems.slice(0, count));
    } else setMenuItemsRender(menuItems);
  }, [count, menuItems]);
  const handleClearSearch = () => {
    // Clear search term
    setSearch("");
    // Reset menu items to the original state
    setMenuItems(menu);
    // Reset count
    setCount(7);
  };
  const handleCategorySelect = (categoryName) => {
    // Nếu người dùng chọn "All events", reset trạng thái và hiển thị tất cả các sự kiện
    if (categoryName === "") {
      searchMenu(search, menu); // Reset menu items to the original state
    } else {
      // Nếu người dùng chọn một thể loại mới, lọc menu items tương ứng
      searchMenu(search, menu);
      console.log(menuItems);
      const filteredItems = menuItems.filter((item) => {
        return item.categories.some(
          (category) => category.category === categoryName
        );
      });
      setSelectedCategory(categoryName);
      setMenuItems(filteredItems);
    }
    // Reset count
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
                  <Link
                    href={"/menu"}
                    className="flex-none rounded-md text-sm font-semibold shadow-sm w-auto mb-4 absolute right-2"
                    onClick={handleClearSearch}
                  >
                    <Close />
                  </Link>
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
      <div className="mt-8 flex gap-8 justify-center">
        <select
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md w-40"
          value={selectedCategory || ""}
          onChange={(e) => handleCategorySelect(e.target.value)}
        >
          <option value="">All events</option>
          {categories.length > 0 &&
            categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
        </select>
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
      <div className="grid grid-cols-4 gap-4 mt-8">
        {menuItemsRender.length > 0 &&
          menuItemsRender.map((item, index) => (
            <MenuItemInMenu key={item._id} {...item} index={index} />
          ))}
      </div>
      {menuItems.length > count && (
        <div className="flex items-center justify-center py-6">
          <div
            onClick={() => setCount(count + 7)}
            className="items-center bg-primary rounded-full text-white px-20 py-4 font-semibold cursor-pointer"
          >
            More events...
          </div>
        </div>
      )}
    </section>
  );
}
