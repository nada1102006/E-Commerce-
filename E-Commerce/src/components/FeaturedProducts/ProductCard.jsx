// import { Link } from 'react-router-dom';
// import { FiHeart, FiShoppingCart } from 'react-icons/fi';
// import { getDiscountPercent, getFinalPrice, hasDiscount } from '../../utils/product';
// import { useNavigate } from 'react-router-dom';

// export default function ProductCard({ product, isDarkMode, isFavorite, toggleFavorite }) {
//     const navigate = useNavigate();
//     const imageUrl = product?.images?.[0]?.url;
//     const price = Number(product?.price || 0);
//     const finalPrice = getFinalPrice(product);
//     const discounted = hasDiscount(product);
//     const discountPercent = getDiscountPercent(product);

//     return (
//         <div
//            onClick={() => navigate(`/product-details?id=${product._id}`, { state: { product } })}
//             className={`group block overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}
//         >
//             <article>
//                 <div className="relative h-56 overflow-hidden">
//                     {imageUrl ? (
//                         <img
//                             src={imageUrl}
//                             alt={product?.name}
//                             className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
//                         />
//                     ) : (
//                         <div className={`flex h-full items-center justify-center ${isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
//                             No image
//                         </div>
//                     )}

//                     <span className="absolute left-4 top-4 rounded-full bg-primary-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
//                         {product?.category || 'General'}
//                     </span>

//                     {discounted && (
//                         <span className="absolute right-4 top-4 rounded-full bg-danger-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
//                             -{discountPercent}%
//                         </span>
//                     )}

//                     <button
//                         type="button"
//                         onClick={(event) => {
//                             event.preventDefault();
//                             event.stopPropagation();
//                             toggleFavorite(product?._id);
//                         }}
//                         className={`absolute bottom-4 right-4 rounded-full p-2.5 shadow-lg transition ${isDarkMode ? 'bg-slate-900/80 text-slate-100' : 'bg-white/90 text-slate-700'} ${isFavorite ? 'text-danger-500' : ''}`}
//                     >
//                         <FiHeart size={16} className={isFavorite ? 'fill-current' : ''} />
//                     </button>
//                 </div>

//                 <div className="p-5">
//                     <div className="mb-2 flex items-center justify-between gap-2">
//                         <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
//                             {product?.subcategory || 'Featured'}
//                         </p>
//                         <span className={`rounded-full px-2.5 py-1 text-xs ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
//                             {product?.brand || 'Brand'}
//                         </span>
//                     </div>

//                     <h3 className="mb-2 text-lg font-semibold">{product?.name || 'Product name'}</h3>
//                     <p className={`mb-4 line-clamp-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
//                         {product?.shortDescription || product?.description || 'No description available.'}
//                     </p>

//                     <div className="mb-4 flex items-center justify-between">
//                         <div>
//                             {/* <p className="text-lg font-bold text-primary-500">${finalPrice}</p> */}
//                             <p className="flex items-end gap-2">
//                                 <span className="text-3xl md:text-4xl font-black tracking-tight text-primary-500">
//                                     {Number(finalPrice).toLocaleString("en-US", {
//                                         minimumFractionDigits: 2,
//                                         maximumFractionDigits: 2,
//                                     })}
//                                 </span>

//                                 <span className="mb-1 text-sm font-bold uppercase">
//                                     EGP
//                                 </span>
//                             </p>
//                             {discounted && (
//                                 <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
//                                     <span className="line-through">${price}</span>
//                                 </p>
//                             )}
//                         </div>
//                         <div className={`rounded-full p-2.5 ${isDarkMode ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-700'}`}>
//                             <FiShoppingCart size={16} />
//                         </div>
//                     </div>

//                     <span className="block w-full rounded-full bg-primary-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition group-hover:bg-primary-600">
//                         View Details
//                     </span>
//                 </div>
//             </article>
//         </div>
//     );
// }


// //////////////////////////////////////////////////////////////////


// import { FiHeart, FiShoppingCart } from "react-icons/fi";
// import {
//   getDiscountPercent,
//   getFinalPrice,
//   hasDiscount,
// } from "../../utils/product";
// import { useNavigate } from "react-router-dom";

// export default function ProductCard({
//   product,
//   isDarkMode,
//   isFavorite,
//   toggleFavorite,
// }) {
//   const navigate = useNavigate();

//   const imageUrl = product?.images?.[0]?.url;
//   const price = Number(product?.price || 0);
//   const finalPrice = getFinalPrice(product);
//   const discounted = hasDiscount(product);
//   const discountPercent = getDiscountPercent(product);
//   const outOfStock = product?.stock <= 0;

//   return (
//     <div
//       className={`group overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
//       ${
//         outOfStock ? "opacity-50" : ""
//       }
//       ${
//         isDarkMode
//           ? "border-slate-800 bg-slate-900 hover:border-indigo-500"
//           : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-indigo-100"
//       }`}
//     >
//       <article>
//         {/* Image */}
//         <div className="relative h-56 overflow-hidden">
//           {imageUrl ? (
//             <>
//               <img
//                 src={imageUrl}
//                 alt={product?.name}
//                 className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
//               />

//               {outOfStock && (
//                 <>
//                   <div className="absolute inset-0 bg-black/50"></div>

//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <span className="rounded-full bg-red-600 px-6 py-2 font-bold text-white shadow-lg">
//                       Out Of Stock
//                     </span>
//                   </div>
//                 </>
//               )}
//             </>
//           ) : (
//             <div
//               className={`flex h-full items-center justify-center
//               ${
//                 isDarkMode
//                   ? "bg-slate-800 text-slate-500"
//                   : "bg-slate-100 text-slate-400"
//               }`}
//             >
//               No Image
//             </div>
//           )}

//           {/* Category */}
//           <span className="absolute left-4 top-4 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow">
//             {product?.category || "General"}
//           </span>

//           {/* Discount */}
//           {discounted && (
//             <span className="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow">
//               -{discountPercent}%
//             </span>
//           )}

//           {/* Wishlist */}
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               toggleFavorite(product?._id);
//             }}
//             className={`absolute bottom-4 right-4 rounded-full p-3 transition-all duration-300
//             ${
//               isDarkMode
//                 ? "bg-slate-800 text-white hover:bg-slate-700"
//                 : "bg-white text-slate-700 hover:bg-slate-100"
//             }`}
//           >
//             <FiHeart
//               size={18}
//               className={`${isFavorite ? "fill-red-500 text-red-500" : ""}`}
//             />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-5">
//           <div className="mb-3 flex items-center justify-between">
//             <p
//               className={`text-xs uppercase tracking-widest
//               ${
//                 isDarkMode ? "text-slate-400" : "text-slate-500"
//               }`}
//             >
//               {product?.subcategory || "Featured"}
//             </p>

//             <span
//               className={`rounded-full px-3 py-1 text-xs
//               ${
//                 isDarkMode
//                   ? "bg-slate-800 text-slate-300"
//                   : "bg-slate-100 text-slate-600"
//               }`}
//             >
//               {product?.brand || "Brand"}
//             </span>
//           </div>

//           <h3
//             className={`mb-2 text-lg font-bold transition-colors
//             ${
//               isDarkMode
//                 ? "text-white group-hover:text-indigo-400"
//                 : "text-slate-900 group-hover:text-indigo-600"
//             }`}
//           >
//             {product?.name}
//           </h3>

//           <p
//             className={`mb-5 line-clamp-2 text-sm
//             ${
//               isDarkMode
//                 ? "text-slate-400"
//                 : "text-slate-600"
//             }`}
//           >
//             {product?.shortDescription ||
//               product?.description ||
//               "No description available."}
//           </p>

//           {/* Price */}
//           <div className="mb-5 flex items-center justify-between">
//             <div>
//               <p className="flex items-end gap-2">
//                 <span className="text-3xl font-black text-indigo-600">
//                   {Number(finalPrice).toLocaleString()}
//                 </span>

//                 <span
//                   className={`text-sm font-bold
//                   ${
//                     isDarkMode
//                       ? "text-slate-300"
//                       : "text-slate-700"
//                   }`}
//                 >
//                   EGP
//                 </span>
//               </p>

//               {discounted && (
//                 <p
//                   className={`text-sm line-through
//                   ${
//                     isDarkMode
//                       ? "text-slate-500"
//                       : "text-slate-400"
//                   }`}
//                 >
//                   {Number(price).toLocaleString()} EGP
//                 </p>
//               )}
//             </div>

//             <div
//               className={`rounded-full p-3 transition
//               ${
//                 isDarkMode
//                   ? "bg-slate-800 text-white"
//                   : "bg-slate-100 text-slate-700"
//               }`}
//             >
//               <FiShoppingCart size={18} />
//             </div>
//           </div>

//           {/* Button */}
//           <button
//             onClick={() =>
//               navigate(`/product-details?id=${product._id}`, {
//                 state: { product },
//               })
//             }
//             disabled={outOfStock}
//             className={`w-full rounded-full py-3 text-sm font-semibold transition-all duration-300
//             ${
//               outOfStock
//                 ? "cursor-not-allowed bg-gray-500 text-white"
//                 : "bg-indigo-600 text-white hover:bg-indigo-700"
//             }`}
//           >
//             {outOfStock ? "Out Of Stock" : "View Details"}
//           </button>
//         </div>
//       </article>
//     </div>
//   );
// }












import { FiHeart, FiShoppingCart } from "react-icons/fi";
import {
  getDiscountPercent,
  getFinalPrice,
  hasDiscount,
} from "../../utils/product";
import { useNavigate } from "react-router-dom";

export default function ProductCard({
  product,
  isFavorite,
  toggleFavorite,
}) {
  const navigate = useNavigate();

  const imageUrl = product?.images?.[0]?.url;
  const price = Number(product?.price || 0);
  const finalPrice = getFinalPrice(product);
  const discounted = hasDiscount(product);
  const discountPercent = getDiscountPercent(product);
  const outOfStock = product?.stock <= 0;

  return (
    <div
      className={`group overflow-hidden rounded-3xl border
      border-slate-200 dark:border-slate-800
      bg-white dark:bg-slate-900
      transition-all duration-300
      hover:-translate-y-2 hover:shadow-2xl
      hover:border-indigo-300 dark:hover:border-indigo-500
      ${outOfStock ? "opacity-50" : ""}`}
    >
      <article>
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={product?.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {outOfStock && (
                <>
                  <div className="absolute inset-0 bg-black/50"></div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="rounded-full bg-red-600 px-6 py-2 font-bold text-white shadow-lg">
                      Out Of Stock
                    </span>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              No Image
            </div>
          )}

          {/* Category */}
          <span className="absolute left-4 top-4 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow">
            {product?.category || "General"}
          </span>

          {/* Discount */}
          {discounted && (
            <span className="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow">
              -{discountPercent}%
            </span>
          )}

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(product?._id);
            }}
            className="absolute bottom-4 right-4 rounded-full p-3 transition-all duration-300 bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
          >
            <FiHeart
              size={18}
              className={isFavorite ? "fill-red-500 text-red-500" : ""}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {product?.subcategory || "Featured"}
            </p>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {product?.brand || "Brand"}
            </span>
          </div>

          <h3 className="mb-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
            {product?.name}
          </h3>

          <p className="mb-5 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
            {product?.shortDescription ||
              product?.description ||
              "No description available."}
          </p>
                    {/* Price */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="flex items-end gap-2">
                <span className="text-3xl font-black text-indigo-600">
                  {Number(finalPrice).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </span>

                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  EGP
                </span>
              </p>

              {discounted && (
                <p className="text-sm line-through text-slate-400 dark:text-slate-500">
                  {Number(price).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}{" "}
                  EGP
                </p>
              )}
            </div>

            <div className="rounded-full bg-slate-100 p-3 text-slate-700 transition dark:bg-slate-800 dark:text-white">
              <FiShoppingCart size={18} />
            </div>
          </div>

          {/* Button */}
          <button
            onClick={() =>
              navigate(`/product-details?id=${product._id}`, {
                state: { product },
              })
            }
            disabled={outOfStock}
            className={`w-full rounded-full py-3 text-sm font-semibold transition-all duration-300 ${
              outOfStock
                ? "cursor-not-allowed bg-gray-500 text-white"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {outOfStock ? "Out Of Stock" : "View Details"}
          </button>
        </div>
      </article>
    </div>
  );
}
