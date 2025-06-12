import Header from "@/lib/ui/header/Header";
import HeroSection from "@/lib/ui/pages/home/HeroSection";
import BrandsSection from "@/lib/ui/pages/home/BrandsSection";
import BestsellerSection from "@/lib/ui/pages/home/BestsellerSection";
import ValuesSection from "@/lib/ui/pages/home/ValuesSection";
import SimpleSection from "@/lib/ui/pages/home/SimpleSection";
import Footer from "@/lib/ui/footer/Footer";

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
