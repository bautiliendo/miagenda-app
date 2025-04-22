import Navbar from "@/components/NavBar";
import Hero from "@/sections/Hero";
import Features from "@/sections/Features";
import Pricing from "@/sections/Pricing";
import Footer from "@/sections/Footer";
import FAQ from "@/sections/Faq";

export default async function Home() {

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <FAQ />
        <Pricing />
        <Footer />
      </main>
    </>
  );
}
