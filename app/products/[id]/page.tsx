import { prisma } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AddToCartSection from '@/lib/ui/components/AddToCartSection';


interface Props {
  params: { id: string };
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { images: true },
  });

  if (!product) return notFound();

  const imageUrl = product.images[0]?.url || '/placeholder.png';

  return (
    <div className="container mx-auto px-4 py-12 max-w-screen-lg">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/2">
          <Image
            src={imageUrl}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-lg object-cover w-full max-h-[500px]"
          />
        </div>

        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl font-semibold text-gray-800">${product.price.toFixed(2)}</p>
          <p className="text-gray-700">{product.description || 'No description provided.'}</p>

          <AddToCartSection productId={product.id} />
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Product Description</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          {product.description
            ? product.description.split('. ').map((line, idx) => (
                <li key={idx}>{line.trim()}</li>
              ))
            : <li>No additional details available.</li>
          }
        </ul>
      </div>
    </div>
  );
}
