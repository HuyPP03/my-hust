import Link from "next/link";

export const Sibar = () => {
  return (
    <div className="w-56 fixed z-40 bg-white">
      <ul className="py-2 border-b-2">
        <li className="pt-2">
          <a href="/" className="flex w-full">
            <img
              src="https://i.imgur.com/NRKmnDM.png"
              alt="Home"
              className="h-6 mr-2"
            />
            <span>Home</span>
          </a>
        </li>
        <li className="pt-2">
          <Link href="/menu" className="flex w-full">
            <img
              src="https://i.imgur.com/YyXHyXv.png"
              alt="music"
              className="h-6 mr-2"
            />
            <span>Live music</span>
          </Link>
        </li>
        <li className="pt-2">
          <Link href="/menu" className="flex w-full">
            <img
              src="https://i.imgur.com/ljaLmnS.png"
              alt="art"
              className="h-6 mr-2"
            />
            <span>Theater - Art Culture</span>
          </Link>
        </li>
        <li className="pt-2">
          <Link href="/menu" className="flex w-full">
            <img
              src="https://i.imgur.com/U2PS6E6.png"
              alt="nightlight"
              className="h-6 mr-2"
            />
            <span>Nightlife</span>
          </Link>
        </li>
        <li className="pt-2">
          <Link href="/menu" className="flex w-full">
            <img
              src="https://cdn02.ticketbox.vn/poster/9dc655de-c68a-11ea-98a5-0242ac110008"
              alt="nHCM"
              className="h-6 mr-2"
            />
            <span>Events in Hai Ba Trung District</span>
          </Link>
        </li>
        <li className="pt-2">
          <Link href="/menu" className="flex w-full">
            <img
              src="https://cdn02.ticketbox.vn/poster/8fa8f509-c68a-11ea-98a5-0242ac110008"
              alt="HN"
              className="h-6 mr-2"
            />
            <span>Events in Long Bien District</span>
          </Link>
        </li>
      </ul>
      <ul className="">
        <li className="pt-2 border-b-2">
          <Link href="/about" className="flex w-full">
            <img
              src="https://i.imgur.com/idHw5Pv.png"
              alt="About"
              className="h-6 mr-2"
            />
            <span>About</span>
          </Link>
        </li>
        <li className="pt-2 border-b-2">
          <Link href="/menu" className="flex w-full">
            <img
              src="https://cdn02.ticketbox.vn/poster/788cb773-42fb-11ee-81b4-0242ac110006"
              alt="menu"
              className="h-6 mr-2"
            />
            <span>Menu</span>
          </Link>
        </li>
        <li className="pt-2 border-b-2">
          <Link href="/contact" className="flex w-full">
            <img
              src="https://i.imgur.com/wRIxZN4.png"
              alt="contact"
              className="h-6 mr-2"
            />
            <span>Contact</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};
