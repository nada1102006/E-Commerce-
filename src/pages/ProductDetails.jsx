import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation, useParams, Link } from "react-router-dom";
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
  Trash2,
} from "lucide-react";
import api from "../api/api";
import { useCart } from "../context/CartContext";
import { toast, ToastContainer } from "react-toastify";

export default function ProductDetails() {
  const [searchParams] = useSearchParams();
  const { id: paramId } = useParams();
  const id = paramId || searchParams.get("id");
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, cart } = useCart();

  const isInCart = (productId) => {
    const targetId = productId || id;
    if (!targetId || !cart?.items) return false;
    return cart.items.some((item) => {
      const pId = item.product?._id || item.product || item.id || item._id;
      return String(pId) === String(targetId);
    });
  };

  const initialProduct = location.state?.product || null;
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlistedState, setIsWishlistedState] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  const [reviews, setReviews] = useState(initialProduct?.reviews || []);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [relatedWishlistLoading, setRelatedWishlistLoading] = useState({});
  const [relatedAddingToCart, setRelatedAddingToCart] = useState({});

  useEffect(() => {
    if (!id) {
      setError("No product ID provided");
      setLoading(false);
      return;
    }

    async function fetchProduct() {
      try {
        if (!initialProduct) setLoading(true);
        const response = await api.get(`/products/${id}`);
        const prod = response.data?.product || response.data?.data || response.data;
        if (prod && (prod._id || prod.id || prod.name)) {
          setProduct(prod);
          setReviews(prod.reviews || []);
          setError(null);
        } else if (!initialProduct) {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Fetch product error:", err);
        if (!initialProduct) {
          setError(err.response?.data?.message || "Failed to load product. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product?.category) return;

    async function fetchRelated() {
      try {
        setRelatedLoading(true);
        const response = await api.get(`/products?category=${encodeURIComponent(product.category)}&limit=8`);
        const list = response.data?.products || response.data?.data || (Array.isArray(response.data) ? response.data : []);
        if (Array.isArray(list)) {
          const filtered = list.filter((p) => (p._id || p.id) !== (product._id || product.id));
          setRelatedProducts(filtered.slice(0, 4));
        }
      } catch (err) {
        console.error("Fetch related error:", err);
      } finally {
        setRelatedLoading(false);
      }
    }

    fetchRelated();
  }, [product?.category, product?._id]);

  useEffect(() => {
    async function fetchWishlist() {
      const token = localStorage.getItem("userToken") || localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await api.get("/wishlists/my");
        if (response.data.success) {
          const list = response.data.wishlist?.products || response.data.wishlist?.items || [];
          const ids = list.map((p) => (typeof p === "string" ? p : p._id || p.id));
          setWishlistIds(ids);
          setIsWishlistedState(ids.includes(id));
        }
      } catch (err) {
        console.error("Fetch wishlist error:", err);
      }
    }

    fetchWishlist();
  }, [id]);

  const isWishlistedInState = wishlistIds.includes(id);
  const isWishlisted = isWishlistedInState || isWishlistedState;

  function formatDate(dateString) {
    if (!dateString) return "Recently";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "Recently";
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recently";
    }
  }

  function getDiscount(price, discountPrice) {
    if (!discountPrice || discountPrice >= price || price <= 0) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  }

  const productImages = (() => {
    if (!product?.images || !Array.isArray(product.images) || product.images.length === 0) {
      return [{ url: product?.image || "https://placehold.co/600x600/e2e8f0/64748b?text=No+Image" }];
    }
    return product.images.map((img) => {
      if (typeof img === "string") return { url: img };
      if (img?.url) return img;
      return { url: "https://placehold.co/600x600/e2e8f0/64748b?text=No+Image" };
    });
  })();

  function setSelectedImageIndex(index) {
    setSelectedImage(index);
  }

  function nextImage() {
    if (!product?.images?.length) return;
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  }

  function prevImage() {
    if (!product?.images?.length) return;
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  }

  function decreaseQuantity() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  function increaseQuantity() {
    setQuantity((prev) => Math.min(product?.stock || 1, prev + 1));
  }

  async function handleAddToCart(productId, qty = 1) {
    const targetId = productId || id;
    if (!targetId) return;

    if (productId) {
      setRelatedAddingToCart((prev) => ({ ...prev, [productId]: true }));
    } else {
      setAddingToCart(true);
    }

    try {
      await addToCart(targetId, qty);
      if (!productId) {
        setCartSuccess(true);
        setTimeout(() => setCartSuccess(false), 2000);
      }
      toast.success("Added to cart successfully!");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error(err.response?.data?.message || "Failed to add to cart. Please try again.");
    } finally {
      if (productId) {
        setRelatedAddingToCart((prev) => ({ ...prev, [productId]: false }));
      } else {
        setAddingToCart(false);
      }
    }
  }

  async function toggleWishlist() {
    if (!id || wishlistLoading) return;
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await api.delete(`/wishlists/remove/${id}`);
        setIsWishlistedState(false);
        setWishlistIds((prev) => prev.filter((wid) => wid !== id));
        toast.info("Removed from wishlist");
        window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { action: "remove" } }));
      } else {
        await api.post(`/wishlists/add/${id}`);
        setIsWishlistedState(true);
        setWishlistIds((prev) => [...prev, id]);
        toast.success("Added to wishlist!");
        window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { action: "add" } }));
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      toast.error(err.response?.data?.message || "Please login to use wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  }

  async function toggleRelatedWishlist(e, productId) {
    e.preventDefault();
    e.stopPropagation();
    if (!productId || relatedWishlistLoading[productId]) return;

    setRelatedWishlistLoading((prev) => ({ ...prev, [productId]: true }));
    const isInWishlist = wishlistIds.includes(productId);
    try {
      if (isInWishlist) {
        await api.delete(`/wishlists/remove/${productId}`);
        setWishlistIds((prev) => prev.filter((wid) => wid !== productId));
        toast.info("Removed from wishlist");
        window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { action: "remove" } }));
      } else {
        await api.post(`/wishlists/add/${productId}`);
        setWishlistIds((prev) => [...prev, productId]);
        toast.success("Added to wishlist!");
        window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { action: "add" } }));
      }
    } catch (err) {
      console.error("Related wishlist error:", err);
      toast.error(err.response?.data?.message || "Please login to use wishlist.");
    } finally {
      setRelatedWishlistLoading((prev) => ({ ...prev, [productId]: false }));
    }
  }

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy link.");
    }
  }

  async function handleSubmitReview(e) {
    e.preventDefault();

    const token = localStorage.getItem("userToken") || localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first to submit a review.");
      return;
    }

    if (reviewRating === 0) {
      toast.warning("Please select a star rating!");
      return;
    }
    if (!reviewComment.trim()) {
      toast.warning("Please write a comment!");
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
        username: "You",
        createdAt: new Date().toISOString(),
      };

      setReviews((prev) => [newReview, ...prev]);
      setReviewRating(0);
      setReviewComment("");
      setReviewSuccess(true);
      toast.success(response.data.message || "Review submitted successfully!");
      setTimeout(() => setReviewSuccess(false), 3000);

      setProduct((prev) => ({
        ...prev,
        rating: response.data.averageRating ?? prev.rating,
        numReviews: response.data.numReviews ?? ((prev.numReviews || 0) + 1),
      }));
    } catch (err) {
      console.error("Submit review error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to submit review. Make sure you are logged in.";
      toast.error(errorMsg);
    } finally {
      setReviewSubmitting(false);
    }
  }

  const currentUser = (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  function canDeleteReview(review) {
    const token = localStorage.getItem("userToken") || localStorage.getItem("token");
    if (!token) return false;
    if (!currentUser) return true;
    if (currentUser.role === "admin") return true;

    const currentUserId = currentUser._id || currentUser.id;
    const reviewUserId = typeof review.user === "object" ? (review.user?._id || review.user?.id) : review.user;
    if (currentUserId && reviewUserId && String(currentUserId) === String(reviewUserId)) return true;

    const currentUsername = currentUser.username || currentUser.name;
    if (currentUsername && (review.username === currentUsername || review.user?.username === currentUsername || review.user?.name === currentUsername)) return true;

    return true;
  }

  async function handleDeleteReview(reviewId) {
    if (!reviewId) return;

    const token = localStorage.getItem("userToken") || localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first to delete a review.");
      return;
    }

    setDeletingReviewId(reviewId);
    try {
      const response = await api.delete(`/products/${id}/reviews/${reviewId}`);

      setReviews((prev) => prev.filter((r) => (r._id || r.id) !== reviewId));
      toast.success(response.data?.message || "Review deleted successfully!");

      setProduct((prev) => ({
        ...prev,
        rating: response.data?.averageRating ?? prev.rating,
        numReviews: response.data?.numReviews ?? Math.max(0, (prev.numReviews || 1) - 1),
      }));
    } catch (err) {
      console.error("Delete review error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to delete review.";
      toast.error(errorMsg);
    } finally {
      setDeletingReviewId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-[#070B1A] text-gray-900 dark:text-white pt-14 sm:pt-16 pb-16 px-4">
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600/20 border-t-indigo-600"></div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0B1120] text-gray-900 dark:text-white flex items-center justify-center px-4 pt-12 sm:pt-16">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{error || "Product not found"}</h2>
          <button
            onClick={() => navigate("/shop")}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors text-white"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const originalPrice = Number(product.price || 0);
  const salePrice = Number(product.discountPrice || 0);
  const hasDiscount = Boolean(salePrice && salePrice > 0 && salePrice < originalPrice);
  const finalPrice = hasDiscount ? salePrice : originalPrice;
  const discountPercent = hasDiscount && originalPrice > 0
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;
  const stockCount = typeof product.stock === "number"
    ? product.stock
    : typeof product.quantity === "number"
    ? product.quantity
    : typeof product.countInStock === "number"
    ? product.countInStock
    : typeof product.inStock === "number"
    ? product.inStock
    : product.stock ? Number(product.stock) : 0;
  const outOfStock = stockCount <= 0;
  const lowStock = stockCount > 0 && stockCount <= 5;

  return (
    <div className="min-h-screen dark:bg-[#070B1A] text-gray-100 pb-20 pt-12 sm:pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="text-xs sm:text-sm text-gray-400 flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="dark:hover:text-white cursor-pointer" onClick={() => navigate("/")}>
            Home
          </span>
          <span>/</span>
          <span className="dark:hover:text-white cursor-pointer" onClick={() => navigate("/shop")}>
            Shop
          </span>
          <span>/</span>
          <span className="text-indigo-400 truncate max-w-[140px] sm:max-w-[280px] md:max-w-none">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="relative dark:bg-[#1e293b] rounded-2xl overflow-hidden aspect-square group">
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
                src={productImages[selectedImage]?.url || productImages[0]?.url}
                alt={product.name}
                className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
              />

              {productImages.length > 1 && (
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
                {selectedImage + 1} / {productImages.length}
              </div>
            </div>

            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((img, index) => (
                  <button
                    key={img.public_id || index}
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

          <div className="space-y-5">
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

            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white mb-2 leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-400">{product.shortDescription}</p>
            </div>

            <div className="flex items-center flex-wrap gap-2 sm:gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      star <= Math.round(product.averageRating || product.ratingsAverage || product.rating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-400 text-xs sm:text-sm">({product.numReviews || 0} reviews)</span>
              {!outOfStock ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs sm:text-sm font-semibold border border-emerald-500/20">
                  In Stock ({stockCount} available)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs sm:text-sm font-semibold border border-red-500/20">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3 py-3 border-y border-gray-800">
              <span className="text-xl sm:text-2xl font-bold text-indigo-400">EGP {finalPrice}</span>
              {hasDiscount && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">EGP {product.price}</span>
              )}
              {hasDiscount && (
                <span className="text-xs text-red-400 font-medium">-{discountPercent}%</span>
              )}
            </div>

            <div className="text-xs sm:text-sm text-gray-500">
              SKU: <span className="text-gray-300 hover:text-gray-500 cursor-pointer">{product.sku}</span>
            </div>

            {Array.isArray(product.tags) && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-300 text-black dark:bg-gray-800 dark:text-gray-400 text-xs rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-4 pt-2">
              <div className="flex items-center flex-wrap gap-3 sm:gap-4">
                <span className="text-gray-400 text-xs sm:text-sm hover:text-gray-500 cursor-pointer">Quantity:</span>
                <div className="flex items-center dark:bg-[#1e293b] rounded-lg dark:border border-gray-700 text-black dark:text-white">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="p-2.5 sm:p-3 hover:bg-gray-400 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-l-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 sm:w-12 text-center font-semibold text-base sm:text-lg">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= stockCount}
                    className="p-2.5 sm:p-3 hover:bg-gray-400 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-r-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {!outOfStock && (
                  <span className="text-emerald-400 text-xs sm:text-sm font-medium">
                    {stockCount} in stock
                  </span>
                )}
              </div>

              <div className="flex flex-col min-[360px]:flex-row gap-2.5 sm:gap-3">
                <button
                  onClick={() => handleAddToCart()}
                  disabled={outOfStock || addingToCart || isInCart(id)}
                  className={`w-full min-[360px]:flex-1 flex items-center justify-center gap-2 py-3 sm:py-3.5 px-3 rounded-xl font-semibold text-xs min-[360px]:text-sm sm:text-base md:text-lg transition-all ${
                    isInCart(id)
                      ? "bg-emerald-600 dark:bg-emerald-700 text-white cursor-not-allowed opacity-90"
                      : cartSuccess
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  } disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-400`}
                >
                  {addingToCart ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : isInCart(id) ? (
                    <>
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                      <span className="truncate">Already in Cart</span>
                    </>
                  ) : cartSuccess ? (
                    <>
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> <span className="truncate">Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                      <span className="truncate">{outOfStock ? "Out of Stock" : "Add to Cart"}</span>
                    </>
                  )}
                </button>

                <div className="flex gap-2 shrink-0 justify-end">
                  <button
                    onClick={toggleWishlist}
                    disabled={wishlistLoading}
                    aria-label="Wishlist"
                    className={`p-3 sm:p-3.5 rounded-xl border flex items-center justify-center transition-all flex-1 min-[360px]:flex-none ${
                      isWishlisted
                        ? "bg-red-500/10 border-red-500 text-red-500"
                        : "bg-white dark:bg-slate-800/80 border-gray-300 dark:border-gray-700 text-slate-700 dark:text-gray-300 hover:border-pink-500 dark:hover:border-pink-500 hover:text-pink-500 dark:hover:text-pink-400 shadow-sm"
                    }`}
                  >
                    {wishlistLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-red-500 border-t-transparent"></div>
                    ) : (
                      <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isWishlisted ? "fill-red-500" : ""}`} />
                    )}
                  </button>

                  <button
                    onClick={handleShare}
                    aria-label="Share product"
                    className="p-3 sm:p-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-gray-300 hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center transition-all flex-1 min-[360px]:flex-none shadow-sm"
                  >
                    <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4">
              <div className="flex flex-col bg-gray-50 items-center text-center gap-1.5 sm:gap-2 p-2.5 sm:p-4 dark:bg-[#1e293b] rounded-xl">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 shrink-0" />
                <span className="text-[11px] sm:text-xs text-black dark:text-gray-400 font-medium">Fast Delivery</span>
              </div>
              <div className="flex flex-col bg-gray-50 items-center text-center gap-1.5 sm:gap-2 p-2.5 sm:p-4 dark:bg-[#1e293b] rounded-xl">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 shrink-0" />
                <span className="text-[11px] sm:text-xs text-black dark:text-gray-400 font-medium">Secure Payment</span>
              </div>
              <div className="flex flex-col bg-gray-50 items-center text-center gap-1.5 sm:gap-2 p-2.5 sm:p-4 dark:bg-[#1e293b] rounded-xl">
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 shrink-0" />
                <span className="text-[11px] sm:text-xs text-black dark:text-gray-400 font-medium">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="border-b border-gray-800">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-4 text-sm font-medium capitalize transition-all relative ${
                  activeTab === "description" ? "text-indigo-400" : "text-gray-500 dark:hover:text-gray-300"
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
                  activeTab === "reviews" ? "text-indigo-400" : "text-gray-500 dark:hover:text-gray-300"
                }`}
              >
                Reviews ({reviews.length || 0})
                {activeTab === "reviews" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                )}
              </button>
            </div>
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div>
                <p className="dark:text-gray-300 text-black leading-relaxed text-lg">
                  {product.description || "No description available."}
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-100 dark:bg-[#1e293b] p-6 rounded-xl">
                    <h3 className="font-semibold dark:text-white text-black mb-3">Product Details</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex justify-between">
                        <span>Brand</span>
                        <span className="dark:text-white text-black">{product.brand}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Category</span>
                        <span className="dark:text-white text-black">{product.category}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Subcategory</span>
                        <span className="dark:text-white text-black">{product.subcategory}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>SKU</span>
                        <span className="dark:text-white text-black">{product.sku}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Stock</span>
                        <span className={outOfStock ? "text-red-400" : lowStock ? "text-orange-400" : "text-green-400"}>
                          {outOfStock ? "Out of Stock" : `${product.stock} available`}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-100 dark:bg-[#1e293b] p-6 rounded-xl">
                    <h3 className="font-semibold dark:text-white text-black mb-3">Shipping Info</h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                      <li className="flex items-start gap-2">
                        <Truck className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <span>Fast delivery across Egypt</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>Secure packaging guaranteed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <RotateCcw className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        <span>14-day return policy</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm">
                  <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-6">Write a Review</h3>

                  {reviewSuccess && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2 text-green-500 dark:text-green-400 font-medium">
                      <Check className="w-5 h-5" />
                      <span>Review submitted successfully!</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Your Rating</label>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            onMouseEnter={() => setReviewHoverRating(star)}
                            onMouseLeave={() => setReviewHoverRating(0)}
                            className="transition-transform hover:scale-110 focus:outline-none p-1"
                          >
                            <Star
                              className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors ${
                                star <= (reviewHoverRating || reviewRating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {reviewRating > 0 && (
                        <p className="mt-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                          {reviewRating === 1 && "Poor"}
                          {reviewRating === 2 && "Fair"}
                          {reviewRating === 3 && "Good"}
                          {reviewRating === 4 && "Very Good"}
                          {reviewRating === 5 && "Excellent"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Your Review</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your thoughts about this product..."
                        rows={4}
                        className="w-full bg-gray-50 dark:bg-[#0B1120] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-medium transition-all shadow-md"
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

                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review._id || review.id} className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border-l-4 border-l-indigo-500">
                        <div className="flex items-start justify-between mb-4 gap-3">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center shrink-0">
                              <User className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                                {review.username || review.user?.name || review.user?.username || review.name || "Anonymous"}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <div className="flex gap-0.5 shrink-0">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-3.5 h-3.5 ${
                                        star <= review.rating
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300 dark:text-gray-600"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                  {formatDate(review.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {canDeleteReview(review) && (
                            <button
                              onClick={() => handleDeleteReview(review._id || review.id)}
                              disabled={deletingReviewId === (review._id || review.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete Review"
                            >
                              {deletingReviewId === (review._id || review.id) ? (
                                <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed font-normal">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                      <Star className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Reviews Yet</h3>
                      <p className="text-gray-500 dark:text-gray-400">Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-8">Related Products</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => {
                const relDiscount = getDiscount(related.price, related.discountPrice);
                const relFinalPrice = related.discountPrice || related.price;
                const relHasDiscount = related.discountPrice && related.discountPrice < related.price;
                const isRelWishlisted = wishlistIds.includes(related._id);

                return (
                  <div
                    key={related._id}
                    className="dark:bg-[#1e293b] rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-800 dark:hover:border-gray-700 transition-all group"
                  >
                    <div className="relative aspect-square bg-stone-50 dark:bg-[#0B1120] p-6 overflow-hidden">
                      <span className="absolute top-3 left-3 z-10 px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-medium rounded-md">
                        {related.category}
                      </span>

                      {relDiscount > 0 && (
                        <span className="absolute top-3 right-10 z-10 px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-md">
                          -{relDiscount}%
                        </span>
                      )}

                      <button
                        onClick={(e) => toggleRelatedWishlist(e, related._id)}
                        disabled={relatedWishlistLoading[related._id]}
                        className={`absolute top-3 right-3 z-10 p-1.5 rounded-full transition-all ${
                          isRelWishlisted
                            ? "bg-red-500/20 text-red-500"
                            : "bg-gray-800/80 text-gray-400 hover:text-red-500"
                        }`}
                      >
                        {relatedWishlistLoading[related._id] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent"></div>
                        ) : (
                          <Heart className={`w-4 h-4 ${isRelWishlisted ? "fill-red-500" : ""}`} />
                        )}
                      </button>

                      <Link to={`/product-details?id=${related._id}`}>
                        <img
                          src={related.images[0]?.url}
                          alt={related.name}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                      </Link>
                    </div>

                    <div className="p-4 space-y-3">
                      <Link to={`/product-details?id=${related._id}`}>
                        <h3 className="font-medium text-black dark:text-white dark:hover:text-indigo-400 transition-colors line-clamp-1">
                          {related.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= Math.round(related.averageRating || related.ratingsAverage || related.rating || 0)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({related.numReviews || 0})</span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-indigo-400">EGP {relFinalPrice}</span>
                        {relHasDiscount && (
                          <span className="text-sm text-gray-500 line-through">EGP {related.price}</span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(related._id, 1)}
                        disabled={related.stock === 0 || relatedAddingToCart[related._id] || isInCart(related._id)}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all text-white ${
                          isInCart(related._id)
                            ? "bg-emerald-600 dark:bg-emerald-700 cursor-not-allowed opacity-90"
                            : "bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                        }`}
                      >
                        {relatedAddingToCart[related._id] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : isInCart(related._id) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <ShoppingCart className="w-4 h-4" />
                        )}
                        {related.stock === 0
                          ? "Out of Stock"
                          : relatedAddingToCart[related._id]
                          ? "Adding..."
                          : isInCart(related._id)
                          ? "In Cart"
                          : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
