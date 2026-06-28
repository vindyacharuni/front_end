import { Routes, Route, Link } from "react-router-dom"
import { toast } from "react-hot-toast"
import Header from "../../components/Header"
import ProductsPage from "./ProductsPage"
import ProductOverview from "./ProductOverview"
import LandingPage from "./LandingPage"
import CheckoutPage from "./CheckoutPage"
import MyOrders from "./MyOrders"

export default function ClientHomePage() {
  return (
    <div className="w-full min-h-screen bg-stone-50 flex flex-col">
      {/* Dynamic Navigation Header */}
      <Header />

      {/* Primary Page Layout View Container */}
      <div className="w-full flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:productId" element={<ProductOverview />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route
            path="/reviews"
            element={
              <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
                <h1 className="text-4xl font-serif font-bold text-stone-900">Product Reviews</h1>
                <p className="text-stone-500 text-sm max-w-md mx-auto">
                  See what our customers have to say about their glow journeys with AuraSkin.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 text-left">
                  {[
                    {
                      user: "Emily R.",
                      rating: 5,
                      title: "Life Changing Cleanser!",
                      text: "I've struggled with dry patches forever, but this gentle cleanser makes my skin feel incredibly soft and hydrated immediately after use.",
                    },
                    {
                      user: "Michael K.",
                      rating: 5,
                      title: "Unreal Glow Booster",
                      text: "The Vitamin C serum works miracles! My skin is much brighter and even. I get compliments all the time now.",
                    },
                  ].map((rev, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-150 shadow-3xs">
                      <div className="flex text-amber-400 text-sm gap-0.5 mb-2">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 mb-1">{rev.title}</h4>
                      <p className="text-xs text-stone-600 leading-relaxed mb-4">"{rev.text}"</p>
                      <span className="text-[10px] font-bold text-stone-400">— {rev.user}</span>
                    </div>
                  ))}
                </div>
              </div>
            }
          />
          <Route
            path="/contact-us"
            element={
              <div className="max-w-xl mx-auto px-6 py-20 text-center space-y-6">
                <h1 className="text-4xl font-serif font-bold text-stone-900">Get in Touch</h1>
                <p className="text-stone-500 text-sm">
                  Have questions about your skincare routine? Send us a message and our glow experts will get back to you.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    toast.success("Message sent! We'll reply within 24 hours.")
                    e.target.reset()
                  }}
                  className="bg-white p-8 rounded-2xl border border-stone-150 shadow-3xs text-left space-y-4"
                >
                  <label className="flex flex-col text-xs font-semibold text-stone-600">
                    Your Name
                    <input type="text" required className="mt-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl" />
                  </label>
                  <label className="flex flex-col text-xs font-semibold text-stone-600">
                    Email Address
                    <input type="email" required className="mt-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl" />
                  </label>
                  <label className="flex flex-col text-xs font-semibold text-stone-600">
                    Message
                    <textarea required rows={4} className="mt-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl" />
                  </label>
                  <button type="submit" className="w-full py-3 bg-stone-900 text-white text-xs font-bold rounded-xl cursor-pointer">
                    Send Message
                  </button>
                </form>
              </div>
            }
          />
          <Route
            path="/about-us"
            element={
              <div className="max-w-3xl mx-auto px-6 py-20 space-y-6 text-center">
                <h1 className="text-4xl font-serif font-bold text-stone-900">Our Story</h1>
                <p className="text-stone-600 text-sm leading-relaxed max-w-xl mx-auto">
                  AuraSkin was founded with a simple belief: that healthy skin is the foundation of confidence. We design clinical-grade skincare routines that utilize bio-active organic compounds to hydrate, treat, and repair your skin barrier.
                </p>
                <div className="grid grid-cols-3 gap-6 pt-10 text-left">
                  <div className="p-4 bg-white border border-stone-100 rounded-xl text-center">
                    <h3 className="text-2xl font-bold text-indigo-600">100%</h3>
                    <p className="text-[10px] text-stone-400 mt-1 uppercase font-bold tracking-wider">Vegan Formulas</p>
                  </div>
                  <div className="p-4 bg-white border border-stone-100 rounded-xl text-center">
                    <h3 className="text-2xl font-bold text-indigo-600">45k+</h3>
                    <p className="text-[10px] text-stone-400 mt-1 uppercase font-bold tracking-wider">Happy Customers</p>
                  </div>
                  <div className="p-4 bg-white border border-stone-100 rounded-xl text-center">
                    <h3 className="text-2xl font-bold text-indigo-600">Zero</h3>
                    <p className="text-[10px] text-stone-400 mt-1 uppercase font-bold tracking-wider">Synthetic Dyes</p>
                  </div>
                </div>
              </div>
            }
          />
          <Route
            path="/*"
            element={
              <div className="max-w-md mx-auto px-6 py-24 text-center space-y-4">
                <h1 className="text-6xl font-serif font-bold text-stone-300">404</h1>
                <h2 className="text-xl font-bold text-stone-900">Page Not Found</h2>
                <p className="text-stone-500 text-xs">
                  The page you are looking for might have been removed or is temporarily unavailable.
                </p>
                <Link
                  to="/"
                  className="inline-block px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-full"
                >
                  Return Home
                </Link>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  )
}