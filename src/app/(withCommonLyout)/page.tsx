import Hero from "@/components/module/home/Hero";
import Locations from "@/components/module/home/Location";
import WorkProcess from "@/components/module/home/WorkProcess";

export default function Home() {
  return (
    <div className="w-full  ">
       <Hero />
       <Locations/>
       <WorkProcess />
    </div>
  );
}


