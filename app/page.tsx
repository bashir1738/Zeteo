import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Subscription from "./components/Subscription";
import FAQ from "./components/FAQ";
import BackgroundAnimation from "./components/BackgroundAnimation";
import Footer from "./components/Footer";
import { FaXTwitter, FaGithub, FaDiscord } from "react-icons/fa6";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <Subscription />
      <FAQ />
      <Footer />
    </div>
  );
}
