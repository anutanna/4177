import { prisma } from "@/lib/db/prisma";

async function main() {
  const product = await prisma.product.findUnique({
    where: { id: "687ffa1cfe729cb050485592" },
    include: { business: true },
  });

  console.log("Product with business:", product);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
