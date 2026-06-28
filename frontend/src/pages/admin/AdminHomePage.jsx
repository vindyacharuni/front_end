import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import { IoAddOutline, IoEyeOutline, IoTrendingUpOutline, IoAlertCircleOutline, IoPeopleOutline, IoBagCheckOutline } from "react-icons/io5"

export default function AdminHomePage() {
  const [statsData, setStatsData] = useState({
    totalRevenue: 0,
    totalProducts: 0,
    totalCategories: 0,
    lowStockCount: 0,
    totalUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/Login");
        return;
      }
      
      try {
        const res = await axios.get("http://localhost:5000/api/users/dashboard-stats", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStatsData({
          totalRevenue: res.data.totalRevenue,
          totalProducts: res.data.totalProducts,
          totalCategories: res.data.totalCategories,
          lowStockCount: res.data.lowStockCount,
          totalUsers: res.data.totalUsers
        });
        setRecentOrders(res.data.recentOrders || []);
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
        setError("Failed to load dashboard statistics.");
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/Login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const stats = [
    {
      label: "Total Revenue",
      value: `$${(statsData.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "Updated live",
      icon: <IoTrendingUpOutline size={20} />,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Products Catalog",
      value: `${statsData.totalProducts || 0} Active`,
      change: `${statsData.totalCategories || 0} Categories in store`,
      icon: <IoBagCheckOutline size={20} />,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      label: "Low Stock Alert",
      value: `${statsData.lowStockCount || 0} Product${statsData.lowStockCount === 1 ? '' : 's'}`,
      change: "Under 15 units left",
      icon: <IoAlertCircleOutline size={20} />,
      color: "text-rose-600 bg-rose-50 border-rose-100",
    },
    {
      label: "Active Customers",
      value: `${statsData.totalUsers || 0} Users`,
      change: "Registered in system",
      icon: <IoPeopleOutline size={20} />,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    }
  ]

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-500 font-medium animate-pulse">Loading dashboard statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-rose-500 font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-stone-50">
      {/* Admin Navbar */}
      <header className="bg-white border-b border-stone-150 h-16 sticky top-0 z-30 flex items-center justify-between px-8 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="font-serif text-xl font-bold tracking-wide text-stone-900">
            BeautyHub Admin
          </span>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Dashboard
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-stone-500 hover:text-stone-950 text-xs font-semibold hover:underline"
          >
            ← Return to Store
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10 space-y-10 animate-fade-in">
        {/* Title Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900">Dashboard Overview</h1>
            <p className="text-stone-500 text-xs mt-1">
              Welcome back, Administrator. Here is a summary of store activity.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/addProduct"
              className="px-4 py-2 bg-indigo-655 hover:bg-indigo-700 bg-indigo-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <IoAddOutline size={16} /> Add New Product
            </Link>
            <Link
              to="/admin/viewProducts"
              className="px-4 py-2 bg-white border border-stone-250 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <IoEyeOutline size={16} /> View Products
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-stone-150/40 shadow-3xs flex justify-between items-center hover:shadow-sm transition-all"
            >
              <div className="space-y-2">
                <span className="text-stone-500 text-xs font-semibold tracking-wide block">{stat.label}</span>
                <span className="text-2xl font-bold text-stone-900 block">{stat.value}</span>
                <span className="text-[10px] font-bold text-stone-400 block">{stat.change}</span>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${stat.color} shrink-0`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Action Blocks & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Quick Operations panel */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-stone-150/40 shadow-3xs space-y-6">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-50 pb-2">
              Catalog Management
            </h3>
            <div className="space-y-3">
              <Link
                to="/admin/addProduct"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-stone-50 hover:bg-indigo-50/50 hover:text-indigo-650 group border border-stone-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 shrink-0">
                  <IoAddOutline size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-800">Add Product</h4>
                  <p className="text-[10px] text-stone-400 mt-0.5">Upload new images and configure pricing.</p>
                </div>
              </Link>

              <Link
                to="/admin/viewProducts"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-stone-50 hover:bg-indigo-50/50 hover:text-indigo-650 group border border-stone-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 shrink-0">
                  <IoEyeOutline size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-800">Manage Catalog</h4>
                  <p className="text-[10px] text-stone-400 mt-0.5">Edit, restock, or remove store products.</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Activity Log list */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-stone-150/40 shadow-3xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-50 pb-2">
              Recent Activity Logs
            </h3>
            <div className="divide-y divide-stone-100">
              {recentOrders.length > 0 ? (
                recentOrders.map((order, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3 text-xs">
                    <span className="text-stone-600 font-medium">
                      Order #{order.orderId} placed by {order.name || "Customer"} (${(order.total || 0).toFixed(2)})
                    </span>
                    <span className="text-stone-400">{formatTimeAgo(order.date)}</span>
                  </div>
                ))
              ) : (
                <div className="py-4 text-xs text-stone-400 text-center">
                  No recent order activity.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}