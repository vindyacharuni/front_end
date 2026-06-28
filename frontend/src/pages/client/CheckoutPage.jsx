import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { getCart, getTotal, clearCart } from "../../utils/cart"
import { toast } from "react-hot-toast"
import { IoCheckmarkCircleOutline, IoArrowBackOutline, IoChevronForwardOutline } from "react-icons/io5"

export default function CheckoutPage() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  })

  // Simple client-side JWT decoder
  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
      return JSON.parse(jsonPayload)
    } catch (e) {
      return null
    }
  }

  useEffect(() => {
    setItems(getCart())
    setTotal(getTotal())

    const token = localStorage.getItem("token")
    if (token) {
      const user = decodeToken(token)
      if (user) {
        setFormData((prev) => ({
          ...prev,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
        }))
      }
    }
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) {
      toast.error("Your cart is empty.")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please login to place an order.")
      navigate("/Login")
      return
    }

    setLoading(true)

    try {
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.zipCode}`
      const formattedItems = items.map((item) => ({
        productId: item.productId || item.id || item._id,
        quantity: item.quantity || 1,
      }))

      const res = await axios.post(
        "http://localhost:5000/api/orders",
        {
          address: fullAddress,
          phone: formData.phone,
          items: formattedItems,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      clearCart()
      const createdOrder = res.data?.result
      setOrderNumber(createdOrder?.orderId || `AS-${Math.floor(100000 + Math.random() * 900000)}`)
      setOrderPlaced(true)
      toast.success("Order placed successfully!", {
        style: {
          background: "#10b981",
          color: "#fff",
          borderRadius: "12px",
        },
      })
    } catch (err) {
      console.error("Error submitting order:", err)
      const errMsg = err.response?.data?.message || err.message || "Failed to place order."
      toast.error(errMsg)
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center animate-fade-in">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <IoCheckmarkCircleOutline size={48} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-stone-900">Thank You for Your Order!</h2>
        <p className="text-sm text-stone-500 mt-2">
          Your order has been placed successfully and is being processed.
        </p>
        <div className="my-8 p-6 bg-stone-50 rounded-2xl border border-stone-150 inline-block text-left min-w-[280px]">
          <p className="text-xs text-stone-500">Order Number</p>
          <p className="text-base font-bold text-stone-900 font-mono mt-0.5">{orderNumber}</p>
          <div className="border-t border-stone-200/50 mt-4 pt-4 text-xs text-stone-500 space-y-1">
            <p><strong>Shipping to:</strong> {formData.firstName} {formData.lastName}</p>
            <p>{formData.address}, {formData.city}</p>
            <p>Confirmation email sent to: {formData.email}</p>
          </div>
        </div>
        <div>
          <Link
            to="/products"
            className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-full shadow-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center gap-2 text-stone-400 text-xs mb-8">
        <Link to="/products" className="hover:text-stone-700 flex items-center gap-1">
          <IoArrowBackOutline size={12} /> Back to Catalog
        </Link>
        <IoChevronForwardOutline size={10} />
        <span className="text-stone-700 font-semibold">Checkout</span>
      </div>

      <h1 className="text-3xl font-serif font-bold text-stone-900 mb-8">Complete Your Purchase</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-stone-50 rounded-3xl border border-stone-200/50">
          <p className="text-stone-500 text-sm">Your cart is empty. Please add some products before checking out.</p>
          <Link
            to="/products"
            className="inline-block mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full"
          >
            Go to Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            {/* Customer Details */}
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-3xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 border-b border-stone-50 pb-2">
                1. Customer Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col text-xs font-semibold text-stone-600">
                  First Name*
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 px-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-indigo-500 rounded-xl text-stone-900 font-medium focus:outline-none"
                  />
                </label>
                <label className="flex flex-col text-xs font-semibold text-stone-600">
                  Last Name*
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 px-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-indigo-500 rounded-xl text-stone-900 font-medium focus:outline-none"
                  />
                </label>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col text-xs font-semibold text-stone-600">
                  Email Address*
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 px-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-indigo-500 rounded-xl text-stone-900 font-medium focus:outline-none"
                  />
                </label>
                <label className="flex flex-col text-xs font-semibold text-stone-600">
                  Phone Number*
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 px-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-indigo-500 rounded-xl text-stone-900 font-medium focus:outline-none"
                  />
                </label>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-3xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 border-b border-stone-50 pb-2">
                2. Shipping Address
              </h3>
              <label className="flex flex-col text-xs font-semibold text-stone-600">
                Street Address*
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 px-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-indigo-500 rounded-xl text-stone-900 font-medium focus:outline-none"
                />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col text-xs font-semibold text-stone-600">
                  City*
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 px-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-indigo-500 rounded-xl text-stone-900 font-medium focus:outline-none"
                  />
                </label>
                <label className="flex flex-col text-xs font-semibold text-stone-600">
                  Zip/Postal Code*
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="mt-1 px-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-indigo-500 rounded-xl text-stone-900 font-medium focus:outline-none"
                  />
                </label>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-3xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 border-b border-stone-50 pb-2">
                3. Payment Details (Simulation)
              </h3>
              <label className="flex flex-col text-xs font-semibold text-stone-600">
                Card Number*
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  required
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="mt-1 px-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-indigo-500 rounded-xl text-stone-900 font-medium focus:outline-none"
                />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col text-xs font-semibold text-stone-600">
                  Expiration Date*
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                    value={formData.expiry}
                    onChange={handleChange}
                    className="mt-1 px-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-indigo-500 rounded-xl text-stone-900 font-medium focus:outline-none"
                  />
                </label>
                <label className="flex flex-col text-xs font-semibold text-stone-600">
                  CVV*
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    maxLength={4}
                    required
                    value={formData.cvv}
                    onChange={handleChange}
                    className="mt-1 px-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-indigo-500 rounded-xl text-stone-900 font-medium focus:outline-none"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-sm hover:shadow hover:translate-y-[-1px] active:translate-y-0 cursor-pointer"
            >
              {loading ? "Placing Order..." : `Pay $${(total + 5.99).toFixed(2)} Now`}
            </button>
          </form>

          {/* Cart summary */}
          <div className="lg:col-span-5 bg-stone-50 p-6 rounded-2xl border border-stone-150 sticky top-24">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-3 mb-4">
              Order Summary
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-3 mb-6 pr-2 scrollbar-thin">
              {items.map((item) => {
                const itemId = item.id || item.productId || item._id
                return (
                  <div key={itemId} className="flex gap-3 justify-between items-center text-xs">
                    <div className="flex gap-2 items-center min-w-0">
                      <div className="w-10 h-10 bg-white rounded border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                        <img
                          src={item.image || item.images?.[0] || "/default-product.jpg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-stone-800 truncate max-w-[160px]">{item.name}</h4>
                        <span className="text-stone-400 text-[10px]">Qty: {item.quantity || 1}</span>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900 shrink-0">
                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-stone-200 pt-4 space-y-2.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-stone-900">$5.99</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-3 text-sm font-bold text-stone-900">
                <span>Total</span>
                <span className="text-indigo-600">${(total + 5.99).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
