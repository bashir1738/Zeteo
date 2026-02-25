import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Subscription from "./components/Subscription";
import FAQ from "./components/FAQ";
import BackgroundAnimation from "./components/BackgroundAnimation";
import { FaXTwitter, FaGithub, FaDiscord } from "react-icons/fa6";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <Subscription />
      <FAQ />
      <footer className="relative py-12 bg-black/5 text-center flex flex-col items-center gap-6 overflow-hidden">
        <BackgroundAnimation />
        <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-7xl px-4">
          <div className="flex items-center gap-6 border-b border-white/5 pb-6 w-full max-w-xs justify-center">
            <a
              href="https://x.com/Zeteo_starknet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-all transform hover:scale-110"
              aria-label="Follow us on X"
            >
              <FaXTwitter className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/bashir1738/Zeteo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-all transform hover:scale-110"
              aria-label="View on GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </a>
            <a
              href="https://discord.gg/FdUvJe86"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#5865F2] transition-all transform hover:scale-110"
              aria-label="Join our Discord"
            >
              <FaDiscord className="w-5 h-5" />
            </a>
          </div>
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Zeteo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
