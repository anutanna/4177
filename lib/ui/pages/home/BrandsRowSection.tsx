import Image from "next/image";

const brandLogos = ["elvis", "comax", "mba", "hp", "nocoffee"];

export default function BrandsRowSection() {
  return (
    <section className="flex justify-center gap-6 py-8 px-4 bg-orange-50">
      {brandLogos.map((brand, index) => (
        <Image
          key={index}
          src={`/brands/${brand}.png`}
          alt={brand}
          width={48}
          height={48}
          className="object-contain"
        />
      ))}
    </section>
  );
}
