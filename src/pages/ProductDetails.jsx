import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  Share2,
  Check,
  AlertCircle,
  Send,
  User,
} from "lucide-react";
import api from "../api/api";

// ============================================================

function ProductDetails() {
  // --- URL parameter (product ID from the route) ---
  const { id } = useParams();
  const navigate = useNavigate();

  // --- State Variables ---
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Related products state
  const [relatedProducts, setRelatedProducts] = useState([]);

  // ============================================================

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.product);
        setReviews(response.data.product.reviews || []);
        setError(null);
      } catch (err) {
        setError("Failed to load product.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // ============================================================
  useEffect(() => {
    async function fetchRelated() {
      if (!product?.category) return;

      try {
        const response = await api.get(`/products?category=${product.category}&limit=8`);
        const filtered = response.data.products.filter(
          (p) => p._id !== product._id
        );
        setRelatedProducts(filtered.slice(0, 4));
      } catch (err) {
        console.error("Related products error:", err);
      }
    }

    fetchRelated();
  }, [product]);

  // ============================================================
 

  // Calculate discount percentage
  function getDiscount(price, discountPrice) {
    if (!discountPrice || discountPrice >= price) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  }

  // Format date for reviews
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // ============================================================
  
  function nextImage() {
    if (product?.images?.length) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  }

  function prevImage() {
    if (product?.images?.length) {
      setSelectedImage(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  }

  // ============================================================
  
  function decreaseQuantity() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  function increaseQuantity() {
    setQuantity((prev) => Math.min(product?.stock || 1, prev + 1));
  }

  // ============================================================
  
  async function handleAddToCart(productId, qty = 1) {
    const targetId = productId || product?._id;
    if (!targetId) return;

    setAddingToCart(true);
    try {
      await api.post("/cart", {
        productId: targetId,
        quantity: qty,
      });
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart.");
    } finally {
      setAddingToCart(false);
    }
  }

  // ============================================================
   async function toggleWishlist() {
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${product._id}`);
      } else {
        await api.post("/wishlist", { productId: product._id });
      }
      setIsWishlisted(!isWishlisted);
    } catch (err) {
      console.error(err);
    }
  }

  // ============================================================
 
  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    } catch (err) {
      console.error(err);
    }
  }

  // ============================================================
  
  async function handleSubmitReview(e) {
    e.preventDefault();

    if (reviewRating === 0) {
      alert("Please select a star rating!");
      return;
    }
    if (!reviewComment.trim()) {
      alert("Please write a comment!");
      return;
    }

    setReviewSubmitting(true);
    try {
      const response = await api.post(`/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });

      const newReview = response.data.review || {
        _id: Date.now().toString(),
        rating: reviewRating,
        comment: reviewComment,
        user: { name: "You" },
        createdAt: new Date().toISOString(),
      };

      setReviews((prev) => [newReview, ...prev]);
      setReviewRating(0);
      setReviewComment("");
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);

      setProduct((prev) => ({
        ...prev,
        numReviews: (prev.numReviews || 0) + 1,
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to submit review. Make sure you're logged in.");
    } finally {
      setReviewSubmitting(false);
    }
  }

  // ============================================================
 
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white px-4 py-8">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-[#1e293b] rounded-2xl h-[500px]"></div>
            <div className="space-y-4">
              <div className="h-8 bg-[#1e293b] rounded w-3/4"></div>
              <div className="h-6 bg-[#1e293b] rounded w-1/4"></div>
              <div className="h-4 bg-[#1e293b] rounded w-full"></div>
              <div className="h-12 bg-[#1e293b] rounded w-1/3 mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  
  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            {error || "Product not found"}
          </h2>
          <button
            onClick={() => navigate("/shop")}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
 
  const discountPercent = getDiscount(product.price, product.discountPrice);
  const finalPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  // ============================================================

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 pb-20">
      {/* ===== BREADCRUMB ===== */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-400">
          <span className="hover:text-white cursor-pointer" onClick={() => navigate("/")}>
            Home
          </span>
          <span className="mx-2">/</span>
          <span className="hover:text-white cursor-pointer" onClick={() => navigate("/shop")}>
            Shop
          </span>
          <span className="mx-2">/</span>
          <span className="text-indigo-400">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ===== PRODUCT GRID (Image + Info) ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* --- LEFT: IMAGE GALLERY --- */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-[#1e293b] rounded-2xl overflow-hidden aspect-square group">
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{discountPercent}%
                </div>
              )}
              {outOfStock && (
                <div className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center">
                  <span className="bg-gray-800 text-white px-6 py-2 rounded-full text-lg font-bold border border-gray-600">
                    Out of Stock
                  </span>
                </div>
              )}

              <img
                src={product.images[selectedImage]?.url}
                alt={product.name}
                className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {product.images.length}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={img.public_id}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-indigo-500 ring-2 ring-indigo-500/20"
                        : "border-gray-700 hover:border-gray-500"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT: PRODUCT INFO --- */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-medium rounded-full border border-indigo-500/20">
                {product.category}
              </span>
              <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-medium rounded-full border border-purple-500/20">
                {product.subcategory}
              </span>
              <span className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs font-medium rounded-full">
                {product.brand}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {product.name}
              </h1>
              <p className="text-gray-400 text-lg">{product.shortDescription}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(product.averageRating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-400 text-sm">
                ({product.numReviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 py-4 border-y border-gray-800">
              <span className="text-4xl font-bold text-indigo-400">
                EGP {finalPrice}
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-500 line-through">
                  EGP {product.price}
                </span>
              )}
              {lowStock && !outOfStock && (
                <span className="ml-auto text-orange-400 text-sm font-medium flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Only {product.stock} left
                </span>
              )}
            </div>

            {/* SKU */}
            <div className="text-sm text-gray-500">
              SKU: <span className="text-gray-300">{product.sku}</span>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity + Buttons */}
            <div className="space-y-4 pt-4">
              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">Quantity:</span>
                <div className="flex items-center bg-[#1e293b] rounded-lg border border-gray-700">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-l-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-r-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleAddToCart()}
                  disabled={outOfStock || addingToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-lg transition-all ${
                    cartSuccess
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500`}
                >
                  {cartSuccess ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      {outOfStock ? "Out of Stock" : "Add to Cart"}
                    </>
                  )}
                </button>

                <button
                  onClick={toggleWishlist}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isWishlisted
                      ? "bg-red-500/10 border-red-500 text-red-500"
                      : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? "fill-red-500" : ""}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-4 rounded-xl border-2 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white transition-all"
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="flex flex-col items-center text-center gap-2 p-4 bg-[#1e293b] rounded-xl">
                <Truck className="w-6 h-6 text-indigo-400" />
                <span className="text-xs text-gray-400">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-4 bg-[#1e293b] rounded-xl">
                <ShieldCheck className="w-6 h-6 text-green-400" />
                <span className="text-xs text-gray-400">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-4 bg-[#1e293b] rounded-xl">
                <RotateCcw className="w-6 h-6 text-orange-400" />
                <span className="text-xs text-gray-400">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== TABS: Description & Reviews ===== */}
        <div className="mt-16">
          {/* Tab Buttons */}
          <div className="border-b border-gray-800">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-4 text-sm font-medium capitalize transition-all relative ${
                  activeTab === "description" ? "text-indigo-400" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Description
                {activeTab === "description" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-4 text-sm font-medium capitalize transition-all relative ${
                  activeTab === "reviews" ? "text-indigo-400" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Reviews ({reviews.length || 0})
                {activeTab === "reviews" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {/* --- DESCRIPTION TAB --- */}
            {activeTab === "description" && (
              <div>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {product.description || "No description available."}
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#1e293b] p-6 rounded-xl">
                    <h3 className="font-semibold text-white mb-3">Product Details</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex justify-between">
                        <span>Brand</span>
                        <span className="text-white">{product.brand}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Category</span>
                        <span className="text-white">{product.category}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Subcategory</span>
                        <span className="text-white">{product.subcategory}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>SKU</span>
                        <span className="text-white">{product.sku}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Stock</span>
                        <span className={outOfStock ? "text-red-400" : lowStock ? "text-orange-400" : "text-green-400"}>
                          {outOfStock ? "Out of Stock" : `${product.stock} available`}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-[#1e293b] p-6 rounded-xl">
                    <h3 className="font-semibold text-white mb-3">Shipping Info</h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                      <li className="flex items-start gap-2">
                        <Truck className="w-4 h-4 text-indigo-400 mt-0.5" />
                        <span>Fast delivery across Egypt</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-400 mt-0.5" />
                        <span>Secure packaging guaranteed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <RotateCcw className="w-4 h-4 text-orange-400 mt-0.5" />
                        <span>14-day return policy</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* --- REVIEWS TAB --- */}
            {activeTab === "reviews" && (
              <div className="space-y-8">
                {/* Write Review Form */}
                <div className="bg-[#1e293b] rounded-2xl p-6 md:p-8">
                  <h3 className="text-lg font-semibold text-white mb-6">Write a Review</h3>

                  {reviewSuccess && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2 text-green-400">
                      <Check className="w-5 h-5" />
                      <span>Review submitted successfully!</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    {/* Star Rating */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-3">Your Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            onMouseEnter={() => setReviewHoverRating(star)}
                            onMouseLeave={() => setReviewHoverRating(0)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-8 h-8 transition-colors ${
                                star <= (reviewHoverRating || reviewRating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-600"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {reviewRating > 0 && (
                        <p className="mt-2 text-sm text-indigo-400">
                          {reviewRating === 1 && "Poor"}
                          {reviewRating === 2 && "Fair"}
                          {reviewRating === 3 && "Good"}
                          {reviewRating === 4 && "Very Good"}
                          {reviewRating === 5 && "Excellent"}
                        </p>
                      )}
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-3">Your Review</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your thoughts about this product..."
                        rows={4}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-medium"
                    >
                      {reviewSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Review
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review._id} className="bg-[#1e293b] rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                {review.user?.name || review.user?.username || "Anonymous"}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-3.5 h-3.5 ${
                                        star <= review.rating
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-600"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Reviews Yet</h3>
                      <p className="text-gray-400">Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== RELATED PRODUCTS ===== */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Related Products</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => {
                const relDiscount = getDiscount(related.price, related.discountPrice);
                const relFinalPrice = related.discountPrice || related.price;
                const relHasDiscount = related.discountPrice && related.discountPrice < related.price;

                return (
                  <div
                    key={related._id}
                    className="bg-[#1e293b] rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all group"
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-[#0f172a] p-6 overflow-hidden">
                      {/* Category Badge */}
                      <span className="absolute top-3 left-3 z-10 px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-medium rounded-md">
                        {related.category}
                      </span>

                      {/* Discount Badge */}
                      {relDiscount > 0 && (
                        <span className="absolute top-3 right-10 z-10 px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-md">
                          -{relDiscount}%
                        </span>
                      )}

                      {/* Wishlist */}
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-3 right-3 z-10 p-1.5 bg-gray-800/80 hover:bg-gray-700 rounded-full text-gray-400 hover:text-red-500 transition-all"
                      >
                        <Heart className="w-4 h-4" />
                      </button>

                      {/* Product Image */}
                      <Link to={`/products/${related._id}`}>
                        <img
                          src={related.images[0]?.url}
                          alt={related.name}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                      </Link>
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-3">
                      <Link to={`/products/${related._id}`}>
                        <h3 className="font-medium text-white hover:text-indigo-400 transition-colors line-clamp-1">
                          {related.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= Math.round(related.averageRating || 0)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({related.numReviews || 0})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-indigo-400">EGP {relFinalPrice}</span>
                        {relHasDiscount && (
                          <span className="text-sm text-gray-500 line-through">EGP {related.price}</span>
                        )}
                      </div>

                      {/* Add to Cart */}
                      <button
                        onClick={() => handleAddToCart(related._id, 1)}
                        disabled={related.stock === 0}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-xl text-sm font-medium"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {related.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;