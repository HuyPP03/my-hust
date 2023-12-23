import Image from "next/image";
import Right from "../Icons/Right";

export const Hero = () => {
  return (
    <div className="grid grid-cols-2 py-6">
      <div className="flex flex-col py-4 justify-center">
        <h1 className="text-4xl font-semibold">
          Everything is better with a Song
        </h1>
        <p className="my-4 text-gray-500">
          Concerts will bring you a feeling of comfort and relaxation after
          working days.
        </p>
        <div className="flex gap-2">
          <button className="bg-primary flex text-white px-4 py-2 rounded-full gap-1 items-center w-auto">
            Order now
            <Right />
          </button>
          <button className="bg-gray-100 flex gap-1 py-2 text-gray-600 rounded-full font-semibold w-auto border-0">
            Learn more
            <Right />
          </button>
        </div>
      </div>
      <div className="relative">
        <Image
          src={"/logo.jpg"}
          alt={""}
          style
          height={300}
          width={300}
          className={"m-auto"}
        />
      </div>
    </div>
  );
};
