import Image from "next/image";

export default function about() {
  return (
    <>
      <section className="image_about"></section>
      <div className="text-center p-4 bg-gray-100">
        <h1 className="text-2xl text-primary font-semibold italic">
          HUSTENTERTAINMENT INFORMATION
        </h1>
        <p className="p-2 text-gray-500">
          Ticketbox is a ticket management and distribution system that helps
          you easily buy and sell event tickets
        </p>
        <div className="grid grid-cols-3 gap-8 pt-4">
          <div>
            <div className="w-12 h-12 m-auto">
              <Image
                src={"/introduction.png"}
                alt={""}
                width={60}
                height={60}
              />
            </div>
            <h2 className="font-semibold py-2">INTRODUCTION</h2>
            <p className="text-gray-500">
              Established in 2013, Ticketbox is the first online event ticket
              distribution platform in Vietnam. We have cooperated with numerous
              event organizers and top-notch large-scale programs. The
              successful events sold through Ticketbox include Super Show 9,
              Concert Ha Anh Tuan, Idecaf theater, TEDx, Tech In Asia, WeChoice
              Awards, Forbes Vietnam, Miss Vietnam, DJ Hardwell, and more.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 m-auto">
              <Image
                src={"/mission.png"}
                alt={""}
                width={60}
                height={60}
                className="pt-2"
              />
            </div>
            <h2 className="font-semibold py-2">MISSION</h2>
            <p className="text-gray-500">
              Ticketbox is constantly improving to assert its pioneering
              position in the event ticket distribution industry in Vietnam.
              With our understanding of technology and the market, we aspire to
              contribute to the development of the Vietnamese event industry, to
              be on par with other countries in the region, and to bring
              international experiences to the audience.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 m-auto">
              <Image src={"/values.png"} alt={""} width={60} height={60} />
            </div>
            <h2 className="font-semibold py-2">CORE VALUES</h2>
            <p className="text-gray-500">
              To us, the value of a business is its contribution to making
              society better. Ticketbox is operated by passionate and
              enthusiastic young people who are eager to make buying and selling
              tickets easier and more convenient for both event organizers and
              attendees.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 py-10 px-4">
        <h1 className="text-2xl text-primary font-semibold italic text-center pb-2">
          HUSTENTERTAINMENT INTRODUCTION
        </h1>
        <div className="text-gray-500">
          <p>Hotline: 0123456789 (M-F 8:30-18:30).</p>
          <p>Email: test@example.com.</p>
          <p>Fanpage: facebook.com.</p>
          <p>Office address: 295 Bach Mai, Hai Ba Trưng, Ha Noi.</p>
        </div>
      </div>
    </>
  );
}
