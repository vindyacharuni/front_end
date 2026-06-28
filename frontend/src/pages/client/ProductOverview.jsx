import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import Loader from "../../components/Loader"
import axios from "axios"
import { toast } from "react-hot-toast"
import { addItem } from "../../utils/cart"
import { IoCartOutline, IoArrowBackOutline, IoStarOutline } from "react-icons/io5"

const sampleProducts = [
  {
    productId: "BP001",
    name: "Hydrating Face Cleanser",
    labelledPrice: 25.00,
    price: 22.00,
    images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80"],
    description: "A gentle hydrating cleanser that removes dirt, oil, and makeup while maintaining skin moisture. Formulated with hyaluronic acid, ceramides, and glycerin to lock in moisture and reinforce the skin's protective barrier.",
    ingredients: "Water (Aqua), Cocamidopropyl Betaine, Sodium Lauroyl Methyl Isethionate, Glycerin, Hyaluronic Acid, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Phenoxyethanol, Ethylhexylglycerin.",
    howToUse: "Wet skin with lukewarm water. Massage cleanser into skin in a gentle, circular motion. Rinse thoroughly and pat dry. Use daily in the morning and evening.",
    category: "skincare",
    stock: 50,
  },
  {
    productId: "BP002",
    name: "Vitamin C Brightening Serum",
    labelledPrice: 42.00,
    price: 38.00,
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80"],
    description: "A powerful, glow-boosting serum formulated with 15% pure Vitamin C (L-Ascorbic Acid), Vitamin E, and Ferulic Acid. Brightens dull complexions, neutralizes environmental free radicals, and visibly reduces the appearance of dark spots and hyperpigmentation.",
    ingredients: "Water (Aqua), Ascorbic Acid (Vitamin C), Ethoxydiglycol, Tocopherol (Vitamin E), Ferulic Acid, Panthenol, Sodium Hyaluronate, Triethanolamine, Phenoxyethanol.",
    howToUse: "Apply 4-5 drops to a dry, clean face and neck in the morning. Pat gently until absorbed. Follow with moisturizer and sunscreen.",
    category: "skincare",
    stock: 30,
  },
  {
    productId: "BP003",
    name: "Rejuvenating Night Cream",
    labelledPrice: 55.00,
    price: 49.00,
    images: ["https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=600&q=80"],
    description: "An intensive overnight moisturizer formulated with bakuchiol (a natural retinol alternative), niacinamide, and multi-peptides. Stimulates overnight cell renewal, repairs the moisture barrier, and visibly smooths fine lines and wrinkles for firmer, youthful-looking skin.",
    ingredients: "Water (Aqua), Shea Butter, Niacinamide, Glycerin, Bakuchiol, Caprylic/Capric Triglycerine, Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7, Sodium Hyaluronate, Ceramide NP.",
    howToUse: "Apply a small amount to clean face and neck in the evening. Massage in upward, circular motions until fully absorbed.",
    category: "skincare",
    stock: 15,
  },
  {
    productId: "BP004",
    name: "Glossy Lip Tint - Aura Glow",
    labelledPrice: 20.00,
    price: 18.00,
    images: ["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80"],
    description: "An ultra-hydrating lip tint that adds a flush of sheer, buildable color with an exceptional high-shine finish. Infused with coconut oil and vitamin E to nourish dry lips and keep them plump throughout the day.",
    ingredients: "Hydrogenated Polyisobutene, Coconut Oil, Ethylene/Propylene Copolymer, Vitamin E, Shea Butter, Sweet Almond Oil, Silica Dimethyl Silylate, Red 7 Lake, Yellow 5 Lake, Iron Oxides.",
    howToUse: "Glide onto bare lips for a sheer wash of color and high shine. Reapply as desired to build depth of color.",
    category: "cosmetics",
    stock: 40,
  },
  {
    productId: "BP005",
    name: "Nourishing Hair Treatment Oil",
    labelledPrice: 38.00,
    price: 34.00,
    images: ["https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80"],
    description: "Deep conditioning argan oil blend designed to restore softness, manageability, and shine to dry or damaged hair. Seals hair cuticles, protects against heat styling, and tames frizz without weighing down hair.",
    ingredients: "Cyclopentasiloxane, Dimethiconol, Argania Spinosa (Argan) Kernel Oil, Jojoba Seed Oil, Sweet Almond Oil, Avocado Oil, Fragrance (Parfum).",
    howToUse: "Apply 2-3 drops to damp hair from mid-lengths to ends before blow drying. Can also be used on dry hair to smooth flyaways and add a glossy finish.",
    category: "haircare",
    stock: 25,
  }
]

export default function ProductOverview() {
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState("loading")
  const [imageIndex, setImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("description")
  const navigate = useNavigate()

  useEffect(() => {
    const id = params.productId
    if (!id) return

    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        if (res.data) {
          setProduct(res.data)
          setStatus("success")
        } else {
          // Look up in sample data if API succeeds but data is empty
          lookupSampleProduct(id)
        }
      })
      .catch(() => {
        // Fallback to sample lookup on API error
        lookupSampleProduct(id)
      })
  }, [params.productId])

  const lookupSampleProduct = (id) => {
    const found = sampleProducts.find((p) => p.productId === id)
    if (found) {
      setProduct(found)
      setStatus("success")
    } else {
      setStatus("error")
    }
  }

  const addToCart = () => {
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
      })
    } catch (e) {
      console.error(e)
    }
  }

  const handleBuyNow = () => {
    try {
      const item = {
        id: product.productId,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "/default-product.jpg",
      }
      addItem(item, 1)
      navigate("/checkout")
    } catch (e) {
      console.error(e)
    }
  }

  if (status === "loading") {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (status === "error" || !product) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center space-y-4">
        <h3 className="text-xl font-bold text-stone-900">Product Not Found</h3>
        <p className="text-stone-500 text-xs">We couldn't retrieve the details for this product ID.</p>
        <Link to="/products" className="inline-block px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-full">
          Back to Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Back Link */}
      <Link to="/products" className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 text-xs font-semibold mb-8">
        <IoArrowBackOutline size={14} /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start bg-white p-6 sm:p-8 rounded-3xl border border-stone-150/40 shadow-xs">
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="w-full h-[460px] bg-stone-50 rounded-2xl border border-stone-100 overflow-hidden flex items-center justify-center p-4">
            <img
              src={product.images?.[imageIndex] || "/default-product.jpg"}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply"
              onError={(e) => {
                e.target.src = "/default-product.jpg"
              }}
            />
          </div>

          {/* Gallery Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImageIndex(idx)}
                  className={`w-18 h-18 rounded-xl bg-stone-50 border overflow-hidden shrink-0 transition-all ${
                    imageIndex === idx ? "border-indigo-650 ring-2 ring-indigo-500/20" : "border-stone-200 hover:border-stone-350"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase block mb-1">
                {product.category || "skincare"}
              </span>
              <h1 className="text-3xl font-serif font-bold text-stone-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mt-2.5">
                <div className="flex text-amber-400 text-sm">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <span className="text-xs text-stone-400 font-semibold">(4.9 out of 5 stars)</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-2xl font-bold flex items-center gap-3">
              {product.labelledPrice > product.price ? (
                <>
                  <span className="text-stone-400 line-through text-lg font-normal">
                    ${Number(product.labelledPrice).toFixed(2)}
                  </span>
                  <span className="text-stone-950 font-serif">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Discounted
                  </span>
                </>
              ) : (
                <span className="text-stone-950 font-serif">
                  ${Number(product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Tab Switched Content */}
            <div className="border-t border-stone-100 pt-6">
              <div className="flex gap-6 border-b border-stone-100 pb-3 text-xs font-bold text-stone-500 uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`pb-3 border-b-2 transition-all cursor-pointer ${
                    activeTab === "description" ? "border-indigo-600 text-stone-900 font-bold" : "border-transparent hover:text-stone-850"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("how-to-use")}
                  className={`pb-3 border-b-2 transition-all cursor-pointer ${
                    activeTab === "how-to-use" ? "border-indigo-600 text-stone-900 font-bold" : "border-transparent hover:text-stone-850"
                  }`}
                >
                  How to Use
                </button>
                <button
                  onClick={() => setActiveTab("ingredients")}
                  className={`pb-3 border-b-2 transition-all cursor-pointer ${
                    activeTab === "ingredients" ? "border-indigo-600 text-stone-900 font-bold" : "border-transparent hover:text-stone-850"
                  }`}
                >
                  Ingredients
                </button>
              </div>

              <div className="py-4 text-sm text-stone-600 leading-relaxed font-sans min-h-[120px]">
                {activeTab === "description" && (
                  <p className="whitespace-pre-line">{product.description}</p>
                )}
                {activeTab === "how-to-use" && (
                  <p className="whitespace-pre-line">{product.howToUse || "Apply daily as part of your skincare routine."}</p>
                )}
                {activeTab === "ingredients" && (
                  <p className="whitespace-pre-line text-xs font-medium text-stone-500 bg-stone-50 p-4 rounded-xl border border-stone-100 font-mono">
                    {product.ingredients || "Water, Glycerin, Organic Extracts, Preservatives."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Buy Buttons */}
          <div className="border-t border-stone-100 pt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={addToCart}
                className="flex-1 min-w-[160px] py-4 bg-white border border-stone-250 hover:bg-stone-50 text-stone-850 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs hover:shadow cursor-pointer"
              >
                <IoCartOutline size={16} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 min-w-[160px] py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs hover:shadow hover:translate-y-[-1px] active:translate-y-0 cursor-pointer"
              >
                Buy Now
              </button>
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-bold text-stone-400 tracking-wider">
              <span>PRODUCT ID: {product.productId}</span>
              <span>STOCK AVAILABLE: {product.stock || 50} units</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
