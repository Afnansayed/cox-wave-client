import Hero from "@/components/module/home/Hero";
import LiveFeed from "@/components/module/home/LiveFeed";
import Locations from "@/components/module/home/Location";
import Partnership from "@/components/module/home/Partnership";
import WorkProcess from "@/components/module/home/WorkProcess";

export default function Home() {
  return (
    <div className="w-full  ">
       <Hero />
       <Locations/>
       <WorkProcess />
        <Partnership/>
       <LiveFeed/>
      
    </div>
  );
}


