import HeroClientWrapper from '@/components/HeroClientWrapper';
import Features from "@/sections/Features";
import Pricing from "@/sections/Pricing";
import Footer from "@/sections/Footer";
import FAQ from "@/sections/Faq";
import Navbar from '@/components/NavBar';


export default async function Home() {

  return (
    <>
      <Navbar />
      <HeroClientWrapper />
      <Features />
      <FAQ />
      <Pricing />
      <Footer />
    </>
  );
}
