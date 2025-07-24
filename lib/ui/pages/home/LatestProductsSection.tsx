import { Suspense } from "react";
import LatestProductsSkeleton from "@/lib/ui/pages/home/LatestProductsSkeleton";
import LatestProductsContent from "@/lib/ui/pages/home/LatestProductsContent";

// Main component with Suspense
export default function LatestProductsSection() {
  return (
    <Suspense fallback={<LatestProductsSkeleton />}>
      <LatestProductsContent />
    </Suspense>
  );
}
