import Navbar from "@/components/NavBar";
import Hero from "@/sections/Hero";
import Features from "@/sections/Features";
import Pricing from "@/sections/Pricing";
import Footer from "@/sections/Footer";
import FAQ from "@/sections/Faq";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

export default async function Home() {
  // const { userId } = await auth();

  // if (userId != null) redirect('/events')

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
