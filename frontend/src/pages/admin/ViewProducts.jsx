import { Link } from 'react-router-dom'
import './ViewProducts.css'

const sampleProducts = [
  {
    productId: "BP001",
    name: "Hydrating Face Cleanser",
    altNames: ["Moisture Cleanser", "Gentle Face Wash"],
    labelledPrice: 2500,
    price: 2200,
    images: ["/images/face-cleanser.jpg"],
    description: "A gentle hydrating cleanser that removes dirt and makeup while maintaining skin moisture.",
    stock: 50,
    isAvailable: true,
    category: "skincare"
  },
  {
    productId: "BP002",
    name: "Vitamin C Brightening Serum",
    altNames: ["Vitamin C Serum", "Glow Serum"],
    labelledPrice: 4200,
    price: 3800,
    images: ["/images/vitamin-c-serum.jpg"],
    description: "A powerful vitamin C serum that brightens skin and reduces dark spots.",
    stock: 30,
    isAvailable: true,
    category: "skincare"
  },
  {
    productId: "BP003",
    name: "Matte Liquid Lipstick",
    altNames: ["Long Wear Lipstick", "Matte Lip Color"],
    labelledPrice: 1800,
    price: 1500,
    images: ["/images/matte-lipstick.jpg"],
    description: "Long-lasting matte lipstick with intense color payoff.",
    stock: 75,
    isAvailable: true,
    category: "makeup"
  },
  {
    productId: "BP004",
    name: "Volumizing Mascara",
    altNames: ["Lash Mascara", "Volume Mascara"],
    labelledPrice: 2200,
    price: 1900,
    images: ["/images/mascara.jpg"],
    description: "Adds dramatic volume and length to eyelashes without clumping.",
    stock: 40,
    isAvailable: true,
    category: "makeup"
  },
  {
    productId: "BP005",
    name: "Aloe Vera Face Moisturizer",
    altNames: ["Daily Moisturizer", "Hydrating Cream"],
    labelledPrice: 3200,
    price: 2800,
    images: ["/images/moisturizer.jpg"],
    description: "Lightweight moisturizer enriched with aloe vera for all skin types.",
    stock: 60,
    isAvailable: true,
    category: "skincare"
  },
  {
    productId: "BP006",
    name: "Rose Water Facial Toner",
    altNames: ["Rose Toner", "Refreshing Toner"],
    labelledPrice: 1700,
    price: 1400,
    images: ["/images/rose-toner.jpg"],
    description: "Refreshing facial toner that balances skin pH and tightens pores.",
    stock: 45,
    isAvailable: true,
    category: "skincare"
  },
  {
    productId: "BP007",
    name: "Argan Oil Hair Serum",
    altNames: ["Hair Shine Serum", "Anti-Frizz Serum"],
    labelledPrice: 2800,
    price: 2500,
    images: ["/images/hair-serum.jpg"],
    description: "Nourishing argan oil serum that reduces frizz and adds shine.",
    stock: 35,
    isAvailable: true,
    category: "haircare"
  },
  {
    productId: "BP008",
    name: "Charcoal Face Mask",
    altNames: ["Deep Cleansing Mask", "Purifying Mask"],
    labelledPrice: 2400,
    price: 2100,
    images: ["/images/charcoal-mask.jpg"],
    description: "Detoxifying charcoal mask that removes impurities and excess oil.",
    stock: 25,
    isAvailable: true,
    category: "skincare"
  },
  {
    productId: "BP009",
    name: "SPF 50 Sunscreen Lotion",
    altNames: ["Sun Protection Cream", "UV Shield"],
    labelledPrice: 3500,
    price: 3200,
    images: ["/images/sunscreen.jpg"],
    description: "Broad-spectrum SPF 50 sunscreen providing protection against UVA and UVB rays.",
    stock: 55,
    isAvailable: true,
    category: "skincare"
  },
  {
    productId: "BP010",
    name: "Nourishing Night Cream",
    altNames: ["Overnight Repair Cream", "Night Moisturizer"],
    labelledPrice: 4500,
    price: 4000,
    images: ["/images/night-cream.jpg"],
    description: "Rich night cream that repairs and rejuvenates skin while you sleep.",
    stock: 20,
    isAvailable: true,
    category: "skincare"
  }
]

export default function ViewProducts(){
    const [products, setProducts] = useState(sampleProducts);
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
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.productId}>
                <td className="img-cell"><img src={p.images?.[0]} alt={p.name} /></td>
                <td className="prod-cell">
                  <div className="prod-name">{p.name}</div>
                  <div className="prod-desc">{p.description}</div>
                </td>
                <td>{p.category}</td>
                <td>{p.price.toLocaleString()}</td>
                <td>{p.stock}</td>
                <td>{p.isAvailable ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link to="/admin/addProduct" className="vp-add">+</Link>
    </div>
  )
}
