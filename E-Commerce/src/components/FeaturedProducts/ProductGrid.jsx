
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  isDarkMode,
  isFavorite,
  toggleFavorite,
}) {
  return (
    <section
      className={`transition-colors duration-300 ${
        isDarkMode ? "bg-slate-950" : "bg-slate-50"
      }`}
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product?._id}
            product={product}
            isDarkMode={isDarkMode}
            isFavorite={isFavorite(product?._id)}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </section>
  );
}