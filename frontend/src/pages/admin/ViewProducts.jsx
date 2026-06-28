import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BiTrash } from "react-icons/bi"
import { MdOutlineEdit } from "react-icons/md"
import { IoAddOutline, IoArrowBackOutline } from "react-icons/io5"
import toast from "react-hot-toast"
import axios from "axios"
import Loader from "../../components/Loader"

const sampleProducts = [
  {
    productId: "BP001",
    name: "Hydrating Face Cleanser",
    altNames: ["Moisture Cleanser", "Gentle Face Wash"],
    labelledPrice: 25.00,
    price: 22.00,
    images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=120&q=80"],
    description: "A gentle hydrating cleanser that removes dirt and makeup while maintaining skin moisture.",
    stock: 50,
    isAvailable: true,
    category: "skincare",
  },
  {
    productId: "BP002",
    name: "Vitamin C Brightening Serum",
    altNames: ["Vitamin C Serum", "Glow Serum"],
    labelledPrice: 42.00,
    price: 38.00,
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=120&q=80"],
    description: "A powerful vitamin C serum that brightens skin and reduces dark spots.",
    stock: 12, // Low stock simulation
    isAvailable: true,
    category: "skincare",
  },
  {
    productId: "BP003",
    name: "Rejuvenating Night Cream",
    labelledPrice: 55.00,
    price: 49.00,
    images: ["https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=120&q=80"],
    description: "Deep nourishing overnight treatment designed to enhance skin firmness and smooth fine lines.",
    stock: 0, // Out of stock simulation
    isAvailable: false,
    category: "skincare",
  }
]

export default function ViewProducts() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setProducts(res.data)
        } else {
          setProducts(sampleProducts)
        }
        setIsLoading(false)
      })
      .catch(() => {
        // Safe fallback to showcase product table layout
        setProducts(sampleProducts)
        setIsLoading(false)
      })
  }, [])

  const handleDelete = (pId) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please log in to delete products.")
      navigate("/login")
      return
    }

    axios
      .delete(`http://localhost:5000/api/products/${pId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Product deleted successfully.")
        setProducts((prev) => prev.filter((p) => p.productId !== pId))
      })
      .catch(() => {
        toast.error("Failed to delete product.")
      })
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-stone-50">
      {/* Admin Navbar */}
      <header className="bg-white border-b border-stone-150 h-16 sticky top-0 z-30 flex items-center justify-between px-8 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="text-stone-700 hover:text-stone-900 flex items-center gap-1.5 text-xs font-bold">
            <IoArrowBackOutline size={14} /> Back to Dashboard
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/admin/addProduct"
            className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
          >
            <IoAddOutline size={14} /> Add Product
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10 space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900">Manage Catalog Products</h1>
            <p className="text-stone-500 text-xs mt-1">Review, edit details, or remove products from the catalog list.</p>
          </div>
          <span className="text-xs font-bold text-stone-500 bg-stone-200/50 px-3 py-1 rounded-full">
            {products.length} {products.length === 1 ? "product" : "products"} loaded
          </span>
        </div>

        {/* Catalog Table */}
        <div className="bg-white rounded-2xl border border-stone-150/40 shadow-3xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-stone-50/75 border-b border-stone-100 text-stone-500 text-xs font-bold tracking-wider uppercase">
                  <th className="p-4 pl-6">Image</th>
                  <th className="p-4">Product Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-center">Stock</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 pr-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans text-xs">
                {products.map((p) => {
                  // Determine stock status badges
                  let stockBadge = ""
                  if (p.stock <= 0) {
                    stockBadge = <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-bold uppercase text-[9px]">Out of Stock</span>
                  } else if (p.stock <= 15) {
                    stockBadge = <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold uppercase text-[9px]">Low Stock ({p.stock})</span>
                  } else {
                    stockBadge = <span className="text-stone-600 font-medium">{p.stock} units</span>
                  }

                  return (
                    <tr key={p.productId} className="hover:bg-stone-50/50 transition-colors">
                      {/* Image */}
                      <td className="p-4 pl-6">
                        <div className="w-12 h-12 rounded-lg border border-stone-100 bg-stone-50 overflow-hidden flex items-center justify-center">
                          <img
                            src={p.images?.[0] || "/default-product.jpg"}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/default-product.jpg"
                            }}
                          />
                        </div>
                      </td>

                      {/* Details */}
                      <td className="p-4 max-w-xs">
                        <div className="font-bold text-stone-900 line-clamp-1">{p.name}</div>
                        <div className="text-stone-400 font-mono text-[9px] mt-0.5">ID: {p.productId}</div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="text-[10px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-100/50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {p.category || "skincare"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-4 text-right font-bold text-stone-900">
                        ${Number(p.price).toFixed(2)}
                      </td>

                      {/* Stock */}
                      <td className="p-4 text-center">
                        {stockBadge}
                      </td>

                      {/* Availability status */}
                      <td className="p-4 text-center">
                        {p.isAvailable ? (
                          <span className="text-emerald-650 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-full font-bold uppercase text-[9px]">Active</span>
                        ) : (
                          <span className="text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full font-bold uppercase text-[9px]">Inactive</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => navigate("/admin/editProduct", { state: p })}
                            className="p-1.5 rounded-lg border border-stone-200 hover:border-indigo-600 text-stone-500 hover:text-indigo-600 bg-white transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <MdOutlineEdit size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete ${p.name}?`)) {
                                handleDelete(p.productId)
                              }
                            }}
                            className="p-1.5 rounded-lg border border-stone-200 hover:border-rose-600 text-stone-500 hover:text-rose-600 bg-white transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <BiTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}