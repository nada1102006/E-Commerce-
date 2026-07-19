// // Import React hooks, theme context, API function, and card component.
// import { useEffect, useState } from 'react';
// import { useTheme } from '../../context/ThemeContext';
// import ViewAll from '../Buttons/ViewAll';
// import ProductCard from './ProductCard';
// import { getProducts } from '../../api/api';

// export default function Products() {
//     // Get dark mode state from context to switch styles.
//     const { isDarkMode } = useTheme();
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [favorites, setFavorites] = useState([]);

//     useEffect(() => {
//         const loadProducts = async () => {
//             try {
//                 const items = await getProducts();
//                 console.log({Products: products})
//                 setProducts(items);
//             } catch (fetchError) {
//                 console.error(fetchError);
//                 setError('Unable to load products from the API.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadProducts();
//     }, []);
//         console.log("Full products array from API:", products);
//     const visibleProducts = products
//         .slice(0, 4);
   
//     // Toggle favorite state for a product card.
//     const toggleFavorite = (productId) => {
//         setFavorites((prev) =>
//             prev.includes(productId)
//                 ? prev.filter((id) => id !== productId)
//                 : [...prev, productId]
//         );
//     };

//     return (
//     <section className="min-h-screen transition-colors duration-300 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 pt-10">
//             <div className="mx-auto max-w-7xl">
//                 <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//                     <div className="max-w-2xl">
//                         <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">
//                             Featured Products
//                         </p>
//                         <h2 className="text-3xl font-bold sm:text-4xl">Discover our best picks</h2>
//                         <p className={`mt-3 text-sm sm:text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
//                             Curated products from the Koda Store API with a smooth light and dark experience.
//                         </p>
//                     </div>

//                     {/* Button to navigate to the shop page */}
//                     <ViewAll />
//                 </div>

//                 {/* Show loading skeleton while products are being fetched */}
//                 {loading ? (
//                     <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
//                         {Array.from({ length: 4 }).map((_, index) => (
//                             <div key={index} className={`animate-pulse rounded-3xl p-4 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
//                                 <div className={`mb-4 h-48 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
//                                 <div className={`mb-2 h-4 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
//                                 <div className={`h-4 w-2/3 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
//                             </div>
//                         ))}
//                     </div>
//                 ) : error ? (
//                     // Display error message if fetch fails.
//                     <div className={`rounded-3xl border p-8 text-center ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
//                         <p className="text-sm text-danger-500">{error}</p>
//                     </div>
//                 ) : (
//                     <>
//                         {/* Render product cards when data is ready */}
//                         <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
//                             {visibleProducts.map((product) => (
//                                 <ProductCard
//                                     key={product?._id}
//                                     product={product}
//                                     isDarkMode={isDarkMode}
//                                     isFavorite={favorites.includes(product?._id)}
//                                     toggleFavorite={toggleFavorite}
//                                 />
//                             ))}
//                         </div>
//                     </>
//                 )}
//             </div>
//         </section>
//     );
// }



// Import React hooks, theme context, API function, and card component.
import { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ViewAll from '../Buttons/ViewAll';
import ProductCard from './ProductCard';
import api, { getProducts } from '../../api/api';

export default function Products() {
    // Get dark mode state from context to switch styles.
    const { isDarkMode } = useTheme();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [wishlistIds, setWishlistIds] = useState(new Set());

    const getProductId = (product) => product?._id || product?.id || product?.uuid || '';

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const items = await getProducts();
                setProducts(items);
            } catch (fetchError) {
                console.error(fetchError);
                setError('Unable to load products from the API.');
            } finally {
                setLoading(false);
            }
        };

        const loadWishlist = async () => {
            try {
                const { data } = await api.get('/wishlists/my');
                const items = Array.isArray(data?.wishlist?.products)
                    ? data.wishlist.products
                    : Array.isArray(data?.wishlist)
                    ? data.wishlist
                    : Array.isArray(data?.items)
                    ? data.items
                    : [];
                setWishlistIds(new Set(items.map((item) => item?._id || item?.id || item?.product?._id || item?.productId?._id || item)));
            } catch (err) {
                console.error('Home wishlist load failed:', err);
            }
        };

        loadProducts();
        loadWishlist();
    }, []);

    const visibleProducts = products.slice(0, 4);
   
    // Toggle favorite state for a product card.
    const toggleFavorite = async (product) => {
        const productId = getProductId(product);
        if (!productId) return;

        const isFavorite = wishlistIds.has(productId);
        try {
            if (isFavorite) {
                await api.delete(`/wishlists/remove/${productId}`);
                setWishlistIds((prev) => {
                    const next = new Set(prev);
                    next.delete(productId);
                    return next;
                });
            } else {
                await api.post(`/wishlists/add/${productId}`);
                setWishlistIds((prev) => {
                    const next = new Set(prev);
                    next.add(productId);
                    return next;
                });
            }
            window.dispatchEvent(new Event('wishlist-updated'));
        } catch (err) {
            console.error('Home favorite toggle failed:', err);
        }
    };

    return (
        <section className={`min-h-screen px-4 py-16 transition-colors duration-300 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">
                            Featured Products
                        </p>
                        <h2 className="text-3xl font-bold sm:text-4xl">Discover our best picks</h2>
                        <p className={`mt-3 text-sm sm:text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            Curated products from the Koda Store API with a smooth light and dark experience.
                        </p>
                    </div>

                    {/* Button to navigate to the shop page */}
                    <ViewAll />
                </div>

                {/* Show loading skeleton while products are being fetched */}
                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className={`animate-pulse rounded-3xl p-4 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                <div className={`mb-4 h-48 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                                <div className={`mb-2 h-4 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                                <div className={`h-4 w-2/3 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    // Display error message if fetch fails.
                    <div className={`rounded-3xl border p-8 text-center ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                        <p className="text-sm text-danger-500">{error}</p>
                    </div>
                ) : (
                    <>
                        {/* Render product cards when data is ready */}
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                            {visibleProducts.map((product) => {
                            const productId = getProductId(product);
                            return (
                                <ProductCard
                                    key={productId || product?.name || 'product-' + Math.random()}
                                    product={product}
                                    isDarkMode={isDarkMode}
                                    isFavorite={productId ? wishlistIds.has(productId) : false}
                                    toggleFavorite={() => toggleFavorite(product)}
                                />
                            );
                        })}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}