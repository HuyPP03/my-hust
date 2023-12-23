import CategoryPage from "@/libs/category";
import DatePage from "@/libs/date";
import Image from "next/image";
import Link from "next/link";

const MenuItem = ({ _id, image, name, date, categories }) => {
  return (
    <Link href={"/event/" + _id} className="flex flex-col justify-end">
      <div className="bg-primary/50 p-2 rounded-lg hover:bg-primary/20 hover:shadow-2xl hover: shadow-black/50 transition-all">
        <Image
          className="w-full"
          src={image}
          alt={""}
          width={300}
          height={300}
        />
        <h1 className="font-semibold text-lg uppercase mt-6">{name}</h1>
        <time className="text-s">{DatePage(date)}</time>
        <p className="">{categories[0].category}</p>
      </div>
    </Link>
  );
};

export default MenuItem;
