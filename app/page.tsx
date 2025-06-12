import Header from "@/lib/ui/Header";
import HeroSection from "@/lib/ui/HeroSection";
import BrandsSection from "@/lib/ui/BrandsSection";
import BestsellerSection from "@/lib/ui/BestsellerSection";
import ValuesSection from "@/lib/ui/ValuesSection";
import SimpleSection from "@/lib/ui/SimpleSection";
import Footer from "@/lib/ui/Footer";

export default function Home() {
  return (
    <div className="page">
      <Header />
      <main>
        <section className="hero-section"><HeroSection /></section>
        <section className="brands-section"><BrandsSection /></section>
        <section className="bestseller-section"><BestsellerSection /></section>
        <section className="values-section"><ValuesSection /></section>
        <section className="simple-section"><SimpleSection /></section>
      </main>
      <Footer />
    </div>
  );
}
