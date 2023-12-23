import Image from "next/image";

const NumberStar = ({ number }) => {
  const stars = [];

  for (let i = 0; i < number; i++) {
    stars.push(
      <div key={i}>
        <Image src={"/star-icon.webp"} width={15} height={15} alt="" />
      </div>
    );
  }

  return <div className="flex">{stars}</div>;
};

export default NumberStar;
