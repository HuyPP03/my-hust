"use client";
import { useEffect, useState } from "react";

export default function CategoryPage(_id) {
  const [category, setCategory] = useState(null);
  useEffect(() => {
    fetch("/api/categories").then((res) => {
      res.json().then((categories) => {
        const category = categories.find((category) => category._id === _id);
        setCategory(category);
      });
    });
  }, []);

  return category?.name;
}
