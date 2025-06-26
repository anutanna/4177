import Header from "@/lib/ui/header/Header";
import Product  from "@/lib/ui/pages/product/ProductPage";
import Footer from "@/lib/ui/footer/Footer";

export default function product() {
  return (
    <div className="page">
      <Header />
      <main>
        <Product />
      </main>

      <Footer />
    </div>
  );
}
