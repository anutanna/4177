export default function BestsellerSection() {
  return (
    <section className="bestseller-section">
      <h2>Popular This Week</h2>
      <p>Browse the most loved products by shoppers across Nova Scotia.</p>
      <button>See Bestsellers</button>
      <div className="product-grid">
        <div className="product-card">Organic Kale</div>
        <div className="product-card">Wooden Bowl</div>
        <div className="product-card">Sourdough Bread</div>
      </div>
    </section>
  );
}
