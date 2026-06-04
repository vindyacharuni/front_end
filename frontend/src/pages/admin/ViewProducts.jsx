import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BiTrash } from 'react-icons/bi'
import './ViewProducts.css'
import { MdOutlineEdit } from 'react-icons/md'
import toast from 'react-hot-toast'
import axios from 'axios'
import Loader from '../../components/Loader'

const sampleProducts = [
  {
    productId: 'BP001',
    name: 'Hydrating Face Cleanser',
    altNames: ['Moisture Cleanser', 'Gentle Face Wash'],
    labelledPrice: 2500,
    price: 2200,
    images: ['/images/face-cleanser.jpg'],
    description: 'A gentle hydrating cleanser that removes dirt and makeup while maintaining skin moisture.',
    stock: 50,
    isAvailable: true,
    category: 'skincare',
  },
  {
    productId: 'BP002',
    name: 'Vitamin C Brightening Serum',
    altNames: ['Vitamin C Serum', 'Glow Serum'],
    labelledPrice: 4200,
    price: 3800,
    images: ['/images/vitamin-c-serum.jpg'],
    description: 'A powerful vitamin C serum that brightens skin and reduces dark spots.',
    stock: 30,
    isAvailable: true,
    category: 'skincare',
  },
]

export default function ViewProducts() {
  const [products, setProducts] = useState(sampleProducts)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // 1. Properly chained Axios request that only runs once
    axios
      .get('http://localhost:5000/api/products')
      .then((res) => {
        setProducts(res.data)
        setIsLoading(false)
      })
      .catch(() => {
        toast.error('Failed to fetch products.')
        setIsLoading(false)
      })
  }, []) // <-- Empty array ensures this only happens on page load

  // 2. Clean early return for the loading state
  if (isLoading) {
    return (
     <Loader />
    )
  }

  // 3. Clean JSX without stray curly braces
  return (
    <div className="vp-page">
      <div className="vp-card">
        <h2>Products</h2>
        
        <table className="vp-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.productId}>
                <td className="img-cell">
                  <img src={p.images?.[0]} alt={p.name} />
                </td>
                <td className="prod-cell">
                  <div className="prod-name">{p.name}</div>
                  <div className="prod-desc">{p.description}</div>
                </td>
                <td>{p.category}</td>
                <td>{p.price?.toLocaleString?.() ?? ''}</td>
                <td>{p.stock}</td>
                <td>{p.isAvailable ? 'Yes' : 'No'}</td>
                <td>
                  <MdOutlineEdit
                    className="vp-edit cursor-pointer"
                    onClick={() => navigate('/admin/editProduct', { state: p })}
                  />
                  
                  <BiTrash
                    className="vp-delete cursor-pointer" // 4. Cursor pointer added!
                    onClick={() => {
                      const token = localStorage.getItem('token')
                      if (!token) {
                        navigate('/login')
                        toast.error('Please log in to delete products.')
                        return
                      }
                      
                      axios
                        .delete(`http://localhost:5000/api/products/${p.productId}`, {
                          headers: { Authorization: `Bearer ${token}` },
                        })
                        .then(() => {
                          toast.success('Product deleted successfully.')
                          // 5. Instantly removes the item without needing to trigger a re-fetch
                          setProducts((prev) => prev.filter((product) => product.productId !== p.productId))
                        })
                        .catch(() => toast.error('Failed to delete product.'))
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link to="/admin/addProduct" className="vp-add">
        +
      </Link>
    </div>
  )
}