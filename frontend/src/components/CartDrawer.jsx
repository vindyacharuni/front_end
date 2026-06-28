import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IoCloseOutline } from "react-icons/io5"
import { BiTrash } from "react-icons/bi"
import {
  getCart,
  updateQuantity,
  removeItem,
  clearCart,
  getTotal,
} from "../utils/cart"

export default function CartDrawer({ isOpen, onClose }) {
  const [items, setItems] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    setItems(getCart())

    const handleCartChange = () => {
      setItems(getCart())
    }

    window.addEventListener("cart-change", handleCartChange)
    return () => {
      window.removeEventListener("cart-change", handleCartChange)
    }
  }, [])

  const handleQty = (id, qty) => {
    updateQuantity(id, qty)
  }

  const handleRemove = (id) => {
    removeItem(id)
  }

  const handleClear = () => {
    clearCart()
  }

  const handleCheckout = () => {
    onClose()
    navigate("/checkout")
  }

  const total = getTotal()

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {items.length} {items.length === 1 ? "item" : "items"} selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-150 text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Close cart"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
          {items.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-gray-55 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900">Your cart is empty</h3>
              <p className="text-sm text-gray-550 mt-1 max-w-[240px]">
                Add products from our catalog to get started.
              </p>
              <button
                onClick={() => {
                  onClose()
                  navigate("/products")
                }}
                className="mt-6 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-full shadow-sm hover:shadow transition-all duration-200"
              >
                Browse Products
              </button>
            </div>
          ) : (
            items.map((item) => {
              const itemId = item.id || item.productId || item._id
              return (
                <div
                  key={itemId}
                  className="flex gap-4 p-4 bg-gray-50/50 hover:bg-gray-50 rounded-xl border border-gray-100/50 transition-all duration-200"
                >
                  <div className="w-20 h-20 bg-white rounded-lg border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={item.image || item.images?.[0] || "/default-product.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/default-product.jpg"
                      }}
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-indigo-600 font-medium mt-0.5">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 bg-white rounded-lg">
                        <button
                          onClick={() => handleQty(itemId, (item.quantity || 1) - 1)}
                          className="px-2 py-1 text-gray-500 hover:text-gray-800 font-bold transition-colors text-xs"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-gray-800">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => handleQty(itemId, (item.quantity || 1) + 1)}
                          className="px-2 py-1 text-gray-500 hover:text-gray-800 font-bold transition-colors text-xs"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(itemId)}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <BiTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
            <div className="flex justify-between items-center text-sm font-semibold text-gray-900">
              <span>Subtotal</span>
              <span className="text-base text-indigo-600 font-bold">
                ${total.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleClear}
                className="w-full py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm rounded-xl transition-colors shadow-sm"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-all duration-200 shadow-sm hover:shadow hover:translate-y-[-1px] active:translate-y-0"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
