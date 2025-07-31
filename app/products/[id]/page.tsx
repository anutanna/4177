import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaTag, FaStar } from "react-icons/fa";
import AddToCartSection from "@/lib/ui/components/AddToCartSection";
import { getVisibleProductById } from "@/lib/actions/db_product_actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  let product;
  try {
    product = await getVisibleProductById(id);
  } catch {
    return notFound();
  }

  const imageUrl = product.images[0]?.url || "/no-image.svg";
  const businessLogoUrl = product.business.logo || "/placeholder-logo.svg";

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      {/* Breadcrumb */}
      <nav className="text-sm breadcrumbs mb-6">
        <ul>
          <li>
            <Link href="/products">Products</Link>
          </li>
          <li className="text-gray-500">{product.name}</li>
        </ul>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image Section */}
        <div className="w-full">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-4">
              <Image
                src={imageUrl}
                alt={product.name}
                width={600}
                height={600}
                className="rounded-lg object-cover w-full max-h-[600px] hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* Product Information Section */}
        <div className="w-full space-y-8">
          {/* Product Details Card */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-8 space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-green-600">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.brand && (
                    <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                      <FaTag className="text-gray-500 text-xs" />
                      <span className="text-sm text-gray-700">
                        {product.brand.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || "No description provided."}
                </p>
              </div>

              {/* Categories */}
              {product.categories && product.categories.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-2">
                    Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((pc) => (
                      <div
                        key={pc.category.id}
                        className="badge badge-outline badge-primary badge-lg px-3 py-1"
                      >
                        {pc.category.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Section */}
              <div className="pt-4 border-t border-gray-200">
                <AddToCartSection
                  productId={product.id}
                  stock={product.stock}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Product Information Section */}
      <div className="mt-16">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Product Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Specifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Specifications
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Brand</span>
                    <span className="font-medium text-gray-800">
                      {product.brand.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Price</span>
                    <span className="font-medium text-green-600">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Availability</span>
                    <span
                      className={`font-medium ${
                        product.stock > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vendor Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Vendor Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full">
                        <Image
                          src={businessLogoUrl}
                          alt={product.business.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {product.business.name}
                      </p>
                      {product.business.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <FaStar className="text-yellow-500 text-sm" />
                          <span className="text-sm text-gray-600">
                            {product.business.rating.toFixed(1)} out of 5
                          </span>
                        </div>
                      )}
                      {product.business.email && (
                        <p className="text-sm text-gray-600">
                          {product.business.email}
                        </p>
                      )}
                      {product.business.phone && (
                        <p className="text-sm text-gray-600">
                          {product.business.phone}
                        </p>
                      )}
                      {product.business.website && (
                        <a
                          href={product.business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                  {product.business.address && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <strong>Address:</strong> {product.business.address}
                    </div>
                  )}
                  {product.business.description && (
                    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg mt-3">
                      <strong>About:</strong> {product.business.description}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Full Description */}
            {product.description && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Full Description
                </h3>
                <div className="prose max-w-none">
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    {product.description
                      .split(". ")
                      .filter((line) => line.trim())
                      .map((line, idx) => (
                        <li key={idx}>{line.trim().replace(/\.$/, "")}.</li>
                      ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
