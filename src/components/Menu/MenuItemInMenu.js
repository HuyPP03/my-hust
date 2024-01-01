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
  artists,
  types,
  index,
}) => {
  var mes = "";
  var i = 0;
for (let one of categories)
{
i++;
mes += ", " + (one.category) ;
if (i === 3)
{
  mes += "...";
  break;
};
}
mes = mes.slice(2);


var mes1 = "";
var i1 = 0;
for (let one of artists)
{
i1++;
mes1+= ", " + (one.name) ;
if (i1 >= 2)
{
  mes1 += "...";
  break;
};
}
mes1 = mes1.slice(2);

let total = 0;
for (let one of types)
{
  total += one.quantity;
}


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
        <h1 className="font-bold text-lg uppercase mt-3">{name}</h1>
        <h2 style={{ fontSize: 'smaller' }} className="font-semibold text-lg uppercase mt">
  {mes1}
</h2>
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
            <p className="">{mes}</p>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <MapIcon className="w-4 h-4" />
            <p className="uppercase">{address}</p>
          </div>
        </div>
        {index < 10 && (
          <span className="absolute left-[-2px] top-[-2px] border_item">
            <span className="absolute left-[-28px] top-[-27px] transform -rotate-45 transform-origin-bottom-left text-white font-semibold">
              HOT
            </span>
          </span>
        )}
        {total <= 0 && (
          <div className="font-semibold absolute top-40 right-0 bg-red-800 text-white p-2 rounded-bl-md">
              SOLD OUT
            </div>
        )}

      </div>
    </Link>
  );
};

export default MenuItemInMenu;