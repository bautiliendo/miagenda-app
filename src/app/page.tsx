import Hero from "@/sections/Hero";
import Features from "@/sections/Features";
import Pricing from "@/sections/Pricing";
import Footer from "@/sections/Footer";
import FAQ from "@/sections/Faq";
import NavbarClientWrapper from '@/components/NavbarClientWrapper';


export default async function Home() {

  return (
    <>
      <NavbarClientWrapper />
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
