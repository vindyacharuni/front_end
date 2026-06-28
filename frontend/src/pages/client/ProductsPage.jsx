import { useState, useEffect } from "react"
import axios from "axios"
import Loader from "../../components/Loader"
import ProductCard from "../../components/ProductCard"
import { IoSearchOutline, IoFilterOutline } from "react-icons/io5"

const sampleProducts = [
  {
    productId: "BP001",
    name: "Hydrating Face Cleanser",
    labelledPrice: 25.00,
    price: 22.00,
    images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80"],
    description: "A gentle hydrating cleanser that removes dirt and makeup while maintaining skin moisture.",
    category: "skincare",
    stock: 50,
  },
  {
    productId: "BP002",
    name: "Vitamin C Brightening Serum",
    labelledPrice: 42.00,
    price: 38.00,
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80"],
    description: "A powerful vitamin C serum that brightens skin and reduces dark spots.",
    category: "skincare",
    stock: 30,
  },
  {
    productId: "BP003",
    name: "Rejuvenating Night Cream",
    labelledPrice: 55.00,
    price: 49.00,
    images: ["https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=400&q=80"],
    description: "Deep nourishing overnight treatment designed to enhance skin firmness and smooth fine lines.",
    category: "skincare",
    stock: 15,
  },
  {
    productId: "BP004",
    name: "Glossy Lip Tint - Aura Glow",
    labelledPrice: 20.00,
    price: 18.00,
    images: ["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80"],
    description: "Ultra-hydrating lip tint that adds a flush of sheer, buildable color with a glassy finish.",
    category: "cosmetics",
    stock: 40,
  },
  {
    productId: "BP005",
    name: "Nourishing Hair Treatment Oil",
    labelledPrice: 38.00,
    price: 34.00,
    images: ["https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=400&q=80"],
    description: "Deep conditioning argan oil blend designed to restore softness, manageability, and shine.",
    category: "haircare",
    stock: 25,
  }
]

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setProducts(res.data)
        } else {
          setProducts(sampleProducts)
        }
      })
      .catch(() => {
        // Safe fallback if server is down
        setProducts(sampleProducts)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((prod) => {
      const matchesSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prod.category && prod.category.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory =
        selectedCategory === "all" ||
        (prod.category && prod.category.toLowerCase() === selectedCategory.toLowerCase())

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      return 0 // "featured" or default
    })

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Title Section */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-4xl font-serif font-bold text-stone-900">Our Skincare & Beauty Catalog</h1>
        <p className="text-sm text-stone-500 max-w-md mx-auto">
          Explore our dermatologist-tested, organic, and ethically sourced solutions for glowing, healthy skin.
        </p>
      </div>

      {/* Filter and Search Bar controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-5 rounded-2xl border border-stone-100 shadow-3xs mb-8">
        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Categories Tab buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {["all", "skincare", "cosmetics", "haircare"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl capitalize transition-all duration-250 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-stone-50 text-stone-600 hover:bg-stone-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
          <IoFilterOutline size={16} className="text-stone-500" />
          <span className="text-xs text-stone-500">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-stone-50 border border-stone-200 text-xs font-semibold px-3 py-2 rounded-xl text-stone-700 focus:outline-none cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Catalog Grid list */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-100 shadow-3xs">
          <p className="text-stone-500 text-sm">No products found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
              setSortBy("featured")
            }}
            className="mt-4 px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center animate-fade-in">
          {filteredProducts.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}