import LatestProducts from "@/lib/ui/pages/home/LatestProductsSection";
import PromotionsBanner  from "@/lib/ui/pages/home/PromoBannerSection";

export default function Home() {
  return (
    <div className="page">

      <main>
        <PromotionsBanner />

        <LatestProducts />
      </main>


    </div>
  );
}
