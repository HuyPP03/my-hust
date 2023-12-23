import { Hero } from "@/components/Layout/Hero";
import { HomeMenu } from "@/components/Layout/HomeMenu";
import { Sibar } from "@/components/Layout/Sibar";
import { Slider } from "@/components/Layout/Slider";

export default function Home() {
  return (
    <>
      <div className="flex gap-4">
        <Sibar />
        <div className="flex-1 ml-60">
          <Slider />
          <Hero />
          <HomeMenu />
        </div>
      </div>
    </>
  );
}
