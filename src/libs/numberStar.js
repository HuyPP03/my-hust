import Image from "next/image";

const NumberStar = ({ number }) => {
  const stars = [];

  for (let i = 0; i < number; i++) {
    stars.push(
      <span
        key={i}
        className={`cursor-pointer text-2xl text-[#ffcc02] leading-4 rounded-full`}
      >
        ★
      </span>
    );
  }

  return <div className="flex">{stars}</div>;
};

export default NumberStar;
