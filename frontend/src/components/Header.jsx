import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { IoCartOutline, IoMenuOutline, IoCloseOutline } from "react-icons/io5"
import { toast } from "react-hot-toast"
import { getItemCount } from "../utils/cart"
import CartDrawer from "./CartDrawer"

// Simple client-side JWT decoder helper
function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Initial count
    setCartCount(getItemCount())

    // Listen to custom cart changes
    const handleCartChange = () => {
      setCartCount(getItemCount())
    }

    window.addEventListener("cart-change", handleCartChange)
    return () => {
      window.removeEventListener("cart-change", handleCartChange)
    }
  }, [])

  // Listen to navigation changes to dynamically reload session state
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      const decoded = decodeToken(token)
      if (decoded) {
        setUser(decoded)
      } else {
        setUser(null)
      }
    } else {
      setUser(null)
    }
    // Close dropdown menu on page navigation
    setMenuOpen(false)
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setMenuOpen(false)
    toast.success("Logged out successfully.", {
      style: {
        background: "#1f2937",
        color: "#fff",
        borderRadius: "12px",
      },
    })
    navigate("/")
  }

  // Helper to determine if route is active
  const isActive = (path) => location.pathname === path

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-md border-b border-stone-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-bold tracking-wide text-stone-900 group-hover:text-indigo-600 transition-colors duration-300">
              BeautyHub
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 group-hover:scale-130 transition-transform duration-300"></span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors duration-250 ${isActive("/") ? "text-indigo-600 font-semibold" : "text-stone-600 hover:text-stone-900"
                }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`text-sm font-medium transition-colors duration-250 ${isActive("/products") ? "text-indigo-600 font-semibold" : "text-stone-600 hover:text-stone-900"
                }`}
            >
              Products
            </Link>
            <Link
              to="/reviews"
              className={`text-sm font-medium transition-colors duration-250 ${isActive("/reviews") ? "text-indigo-600 font-semibold" : "text-stone-600 hover:text-stone-900"
                }`}
            >
              Reviews
            </Link>
            <Link
              to="/about-us"
              className={`text-sm font-medium transition-colors duration-250 ${isActive("/about-us") ? "text-indigo-600 font-semibold" : "text-stone-600 hover:text-stone-900"
                }`}
            >
              About
            </Link>
            <Link
              to="/contact-us"
              className={`text-sm font-medium transition-colors duration-250 ${isActive("/contact-us") ? "text-indigo-600 font-semibold" : "text-stone-600 hover:text-stone-900"
                }`}
            >
              Contact
            </Link>
            <Link
              to="/admin"
              className="text-stone-500 hover:text-indigo-600 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 border border-stone-200 rounded-lg hover:border-indigo-200 transition-all duration-200"
            >
              Admin Dashboard
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                {/* Account Menu Trigger */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-stone-50 border border-stone-200 transition-all duration-200 cursor-pointer"
                >
                  <img
                    src={user.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs font-semibold text-stone-700 hidden sm:inline-block">
                    {user.firstName || "Account"}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-150 rounded-xl shadow-lg py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs font-bold text-stone-900 truncate">{user.firstName} {user.lastName}</p>
                      <p className="text-[10px] text-stone-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/my-orders"
                      onClick={() => setMenuOpen(false)}
                      className="w-full block px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 font-semibold border-b border-stone-100 transition-colors"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-semibold transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/Login"
                  className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/Register"
                  className="hidden sm:inline-block px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-xl hover:bg-stone-50 text-stone-700 hover:text-stone-900 border border-transparent hover:border-stone-150 transition-all duration-250 cursor-pointer"
              aria-label="Open cart"
            >
              <IoCartOutline size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-fade-in shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 rounded-xl hover:bg-stone-50 text-stone-700 hover:text-stone-900 border border-transparent hover:border-stone-150 transition-all duration-250 cursor-pointer md:hidden"
              aria-label="Open menu"
            >
              <IoMenuOutline size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Cart Drawer Panel */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Sidebar content drawer */}
          <div className="relative flex flex-col w-full max-w-xs bg-white h-full shadow-xl z-50 p-6 space-y-8 ml-auto animate-slide-in-right">
            {/* Drawer Close Button */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <span className="font-serif text-xl font-bold tracking-wide text-stone-900">
                BeautyHub
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-stone-50 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <IoCloseOutline size={20} />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex flex-col gap-4 text-sm font-semibold text-stone-600">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className={`py-2 px-3 rounded-lg hover:bg-stone-50 transition-colors ${
                  isActive("/") ? "bg-indigo-50/60 text-indigo-650 font-semibold" : ""
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setSidebarOpen(false)}
                className={`py-2 px-3 rounded-lg hover:bg-stone-50 transition-colors ${
                  isActive("/products") ? "bg-indigo-50/60 text-indigo-650 font-semibold" : ""
                }`}
              >
                Products
              </Link>
              <Link
                to="/reviews"
                onClick={() => setSidebarOpen(false)}
                className={`py-2 px-3 rounded-lg hover:bg-stone-50 transition-colors ${
                  isActive("/reviews") ? "bg-indigo-50/60 text-indigo-650 font-semibold" : ""
                }`}
              >
                Reviews
              </Link>
              <Link
                to="/about-us"
                onClick={() => setSidebarOpen(false)}
                className={`py-2 px-3 rounded-lg hover:bg-stone-50 transition-colors ${
                  isActive("/about-us") ? "bg-indigo-50/60 text-indigo-650 font-semibold" : ""
                }`}
              >
                About
              </Link>
              <Link
                to="/contact-us"
                onClick={() => setSidebarOpen(false)}
                className={`py-2 px-3 rounded-lg hover:bg-stone-50 transition-colors ${
                  isActive("/contact-us") ? "bg-indigo-50/60 text-indigo-650 font-semibold" : ""
                }`}
              >
                Contact
              </Link>
              <Link
                to="/admin"
                onClick={() => setSidebarOpen(false)}
                className="py-2 px-3 rounded-lg border border-stone-250 text-center hover:bg-stone-50 hover:text-indigo-600 text-xs font-bold uppercase tracking-wider transition-all mt-4"
              >
                Admin Dashboard
              </Link>
            </nav>

            {/* Account section */}
            <div className="border-t border-stone-100 pt-6 mt-auto">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-3">
                    <img
                      src={user.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">{user.firstName} {user.lastName}</p>
                      <p className="text-[9px] text-stone-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <Link
                      to="/my-orders"
                      onClick={() => setSidebarOpen(false)}
                      className="w-full text-center py-2 px-3 text-xs font-semibold rounded-lg bg-stone-50 hover:bg-indigo-50/50 text-stone-700 hover:text-indigo-600 transition-colors"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        setSidebarOpen(false)
                        handleLogout()
                      }}
                      className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link
                    to="/Login"
                    onClick={() => setSidebarOpen(false)}
                    className="w-full text-center py-2.5 border border-stone-250 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/Register"
                    onClick={() => setSidebarOpen(false)}
                    className="w-full text-center py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
