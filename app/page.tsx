import LatestProducts from "@/lib/ui/pages/home/LatestProductsSection";
import HeroSection from "@/lib/ui/pages/home/HeroSection";

export default function Home() {
  return (
    <div className="page">
      <main>
        <HeroSection />

        <LatestProducts />
      </main>
    </div>
  );
}
