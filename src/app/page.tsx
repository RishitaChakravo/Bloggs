import Footer from "./components/footer/footer";
import HeroSec from "./components/heroSec/page";
import { NavBar } from "./components/navbar/page";

export default function Home() {
  return (
    <div className="p-0 m-0">
      <NavBar/>
      <HeroSec/>
      <Footer/>
    </div>
  );
}
