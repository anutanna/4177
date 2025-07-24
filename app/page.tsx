import LatestProducts from "@/lib/ui/pages/home/LatestProductsSection";
import HeroSection from "@/lib/ui/pages/home/HeroSection";
import BrandsSection from "@/lib/ui/pages/home/BrandsSection";
import AllProductsSection from "@/lib/ui/pages/home/AllProductsSection";

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  return (
    <div>
      <main>
        <HeroSection />

        <BrandsSection />

        <LatestProducts />

        <AllProductsSection currentPage={currentPage} />
      </main>
    </div>
  );
}
