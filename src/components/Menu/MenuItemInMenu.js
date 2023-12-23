import CategoryPage from "@/libs/category";
import DatePage from "@/libs/date";
import Image from "next/image";
import { Calendar, MapIcon, MenuIcon } from "../Icons/MenuItemIcon";
import Link from "next/link";

const MenuItemInMenu = ({
  _id,
  image,
  name,
  date,
  categories,
  price,
  address,
  index,
}) => {
  const addressReal = address.split(" ");
  console.log(addressReal[addressReal.length - 1]);
  return (
    <Link href={"/event/" + _id} className="flex flex-col justify-end">
      <div className="bg-primary/50 p-2 rounded-lg hover:bg-primary/20 hover:shadow-2xl hover: shadow-black/50 transition-all relative">
        <Image
          className="w-full"
          src={image}
          alt={""}
          width={300}
          height={300}
        />
        <h1 className="font-semibold text-lg uppercase mt-8">{name}</h1>
        <div className="flex justify-between text-sm items-center">
          <span className="h-5">From {price} VND</span>
          <div className="flex items-center gap-1 mt-1">
            <Calendar className="w-4 h-4" />
            <time className="text-s">{DatePage(date)}</time>
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-1">
            <MenuIcon className="w-4 h-4" />
            <p className="">{categories[0].category}</p>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <MapIcon className="w-4 h-4" />
            <p className="uppercase">{addressReal[addressReal.length - 1]}</p>
          </div>
        </div>
        {index < 10 && (
          <span className="absolute left-[-2px] top-[-2px] border_item">
            <span className="absolute left-[-28px] top-[-27px] transform -rotate-45 transform-origin-bottom-left text-white font-semibold">
              HOT
            </span>
          </span>
        )}
      </div>
    </Link>
  );
};

export default MenuItemInMenu;
