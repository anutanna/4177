import LatestProducts from "@/lib/ui/pages/home/LatestProductsSection";
import HeroSection from "@/lib/ui/pages/home/HeroSection";
import BrandsSection from "@/lib/ui/pages/home/BrandsSection";

export default function Home() {
  return (
    <div>
      <main>
        <HeroSection />

        <BrandsSection />

        <LatestProducts />
      </main>
    </div>
  );
}
