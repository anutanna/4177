"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import InventoryTable from "@/lib/ui/inventory/InventoryTable";
import { ProductStatus } from "@prisma/client";

interface InventoryProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  status: ProductStatus;
}

interface InventoryClientProps {
  initialProducts: InventoryProduct[];
}

export default function InventoryClient({
  initialProducts,
}: InventoryClientProps) {
  const router = useRouter();

  const handleProductDeleted = useCallback(() => {
    // Refresh the page to get updated data from the server
    router.refresh();
  }, [router]);

  return (
    <InventoryTable
      products={initialProducts}
      onProductDeleted={handleProductDeleted}
    />
  );
}
