import { Link } from "react-router-dom"
import { toast } from "react-hot-toast"
import { addItem } from "../utils/cart"
import { IoCartOutline, IoEyeOutline } from "react-icons/io5"

export default function ProductCard({ product }) {
  if (!product) return null

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const item = {
        id: product.productId,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "/default-product.jpg",
      }
      addItem(item, 1)
      toast.success(`${product.name} added to cart!`, {
        position: "bottom-right",
        style: {
          background: "#1f2937",
          color: "#fff",
          fontSize: "14px",
          borderRadius: "12px",
        },
      })
    } catch (err) {
      console.error(err)
      toast.error("Failed to add to cart.")
    }
  }

  // Calculate discount percentage if applicable
  const hasDiscount = product.labelledPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.labelledPrice - product.price) / product.labelledPrice) * 100)
    : 0

  return (
    <div className="group relative w-72 bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-350 flex flex-col h-[420px]">
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-4 left-4 z-10 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
          Save {discountPercent}%
        </div>
      )}

      {/* Image Area */}
      <div className="relative w-full h-[240px] bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
        <img
          src={product.images?.[0] || "/default-product.jpg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.src = "/default-product.jpg"
          }}
        />

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/products/${product.productId}`}
            className="w-10 h-10 bg-white hover:bg-indigo-600 text-gray-800 hover:text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all duration-200"
            title="View Details"
          >
            <IoEyeOutline size={18} />
          </Link>
          <button
            onClick={handleAddToCart}
            className="w-10 h-10 bg-white hover:bg-indigo-600 text-gray-800 hover:text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all duration-200"
            title="Add to Cart"
          >
            <IoCartOutline size={18} />
          </button>
        </div>
      </div>

      {/* Details Area */}
      <div className="p-5 flex-1 flex flex-col justify-between min-h-0 bg-white">
        <div>
          {/* Category */}
          <span className="text-[10px] font-bold tracking-widest text-indigo-500 uppercase block mb-1">
            {product.category || "skincare"}
          </span>

          {/* Title */}
          <Link to={`/products/${product.productId}`} className="block group-hover:text-indigo-600 transition-colors">
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-xs text-gray-400 line-through">
                  ${Number(product.labelledPrice).toFixed(2)}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  ${Number(product.price).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-sm font-bold text-gray-900">
                ${Number(product.price).toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white text-xs font-semibold rounded-xl transition-all duration-200 shadow-2xs hover:shadow-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
