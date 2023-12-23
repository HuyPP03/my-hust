"use client";
import DeleteButton from "@/components/Layout/DeleteButton";
import { useProfile } from "@/components/Layout/UseProfile";
import UserTabs from "@/components/Layout/UserTabs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const [categoryName, setCategoryName] = useState("");
  const { loading: profileLoading, data: profileData } = useProfile();
  const [categories, setCategories] = useState([]);
  const [editedCategory, setEditCategory] = useState(null);
  useEffect(() => {
    fetchCategories();
  }, []);
  function fetchCategories() {
    fetch("/api/categories").then((response) => {
      response.json().then((categories) => {
        setCategories(categories);
      });
    });
  }
  async function handleCategorySubmit(e) {
    e.preventDefault();
    try {
      const creationPromise = new Promise(async (resolve, reject) => {
        const data = { name: categoryName };
        if (editedCategory) {
          data._id = editedCategory._id;
        }
        const response = await fetch("/api/categories", {
          method: editedCategory ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        setCategoryName("");
        fetchCategories();
        setEditCategory(null);
        if (response.ok) resolve();
        else reject();
      });
      toast.promise(creationPromise, {
        loading: editedCategory
          ? "Updating category..."
          : "Creating your new category...",
        success: editedCategory ? "Category updated!" : "Category created!",
        error: "Error, sorry...",
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteClick(_id) {
    try {
      const promise = new Promise(async (resolve, reject) => {
        const response = await fetch("/api/categories?_id=" + _id, {
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
      fetchCategories();
    } catch (error) {
      console.log(error);
    }
  }
  if (profileLoading) return "Loading user info...";
  if (!profileData.admin) return "Not an admin!";
  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={true} />
      <h1 className="text-center text-primary text-4xl pt-10 font-semibold italic p-4">
        Categories
      </h1>
      <form onSubmit={handleCategorySubmit}>
        <div className="flex gap-2 items-end">
          <div className="grow">
            <label>
              {editedCategory
                ? `Update category: ${editedCategory.name}`
                : "New category name"}
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div className="pb-4 flex gap-2">
            <button type="submit">
              {editedCategory ? "Update" : "Create"}
            </button>
            {editedCategory && (
              <button
                type="button"
                onClick={() => {
                  setEditCategory(null);
                  setCategoryName("");
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
      <div>
        <h2 className="mt-8 text-sm text-gray-500">Existing categories</h2>
        {categories?.length > 0 &&
          categories.map((category) => (
            <div
              key={category._id} // Thêm key để giúp React xác định mỗi phần tử duy nhất
              className="bg-gray-100 rounded-xl p-2 px-4 flex gap-1 mb-2 items-center"
            >
              <div className="grow">{category.name}</div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditCategory(category);
                    setCategoryName(category.name);
                  }}
                  type="button"
                >
                  Edit
                </button>
                <DeleteButton
                  label="Delete"
                  onDelete={() => handleDeleteClick(category._id)}
                />
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
