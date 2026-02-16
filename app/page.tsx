import Hero from "./components/Hero";
import Subscription from "./components/Subscription";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Subscription />
      <footer className="py-12 bg-black/5 text-center text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} Zeteo. All rights reserved.
      </footer>
    </div>
  );
}
