import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { IoBagHandleOutline, IoLocationOutline, IoCallOutline, IoCalendarOutline } from "react-icons/io5"

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please log in to view your orders.")
      navigate("/Login")
      return
    }

    axios
      .get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data && Array.isArray(res.data.orders)) {
          setOrders(res.data.orders)
        }
      })
      .catch((err) => {
        console.error("Error fetching orders:", err)
        toast.error("Failed to load orders.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [navigate])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-emerald-700 bg-emerald-50 border-emerald-200"
      case "shipped":
        return "text-indigo-700 bg-indigo-50 border-indigo-200"
      case "cancelled":
        return "text-rose-700 bg-rose-50 border-rose-200"
      default:
        return "text-amber-700 bg-amber-50 border-amber-200" // pending
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-3xl font-serif font-bold text-stone-900">My Orders</h1>
        <p className="text-stone-500 text-xs mt-1">
          Review your purchase history and track order delivery status.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-150 shadow-3xs space-y-4">
          <div className="w-16 h-16 bg-stone-50 text-stone-400 rounded-full flex items-center justify-center mx-auto">
            <IoBagHandleOutline size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-stone-800">No Orders Yet</h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              You haven't placed any orders with us yet. Discover our skincare collections.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white rounded-2xl border border-stone-150/80 shadow-3xs overflow-hidden"
            >
              {/* Order Header Summary */}
              <div className="bg-stone-50/70 border-b border-stone-150 px-6 py-4 flex flex-col sm:flex-row justify-between gap-4">
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-6 gap-y-2">
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                      Order ID
                    </span>
                    <span className="text-xs font-bold text-stone-900">
                      #{order.orderId}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                      Date Placed
                    </span>
                    <span className="text-xs text-stone-700 flex items-center gap-1 font-medium">
                      <IoCalendarOutline size={13} className="text-stone-500" />
                      {formatDate(order.date)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                      Total
                    </span>
                    <span className="text-xs font-bold text-indigo-600">
                      ${(order.total || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex sm:justify-end items-center gap-3">
                  <span
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status || "pending"}
                  </span>
                </div>
              </div>

              {/* Order Contents */}
              <div className="p-6 divide-y divide-stone-100">
                {/* Items List */}
                <div className="space-y-4 pb-4">
                  {order.items?.map((item) => (
                    <div key={item.productId} className="flex gap-4 items-center">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=150&q=80"}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-contain border border-stone-150 bg-stone-50/50 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-stone-800 truncate">{item.name}</h4>
                        <p className="text-[10px] text-stone-400 font-medium">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-stone-900">
                          ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Info */}
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-stone-500">
                  <div className="flex gap-2 items-start">
                    <IoLocationOutline size={14} className="text-stone-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-700 block mb-0.5">Shipping Address</span>
                      <span>{order.address || "No address provided"}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <IoCallOutline size={14} className="text-stone-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-700 block mb-0.5">Contact Number</span>
                      <span>{order.phone || "No phone number provided"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
