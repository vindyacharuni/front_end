
import ProductCard from "../../components/ProductCard";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Loader from "../../components/Loader";

export default function ProductsPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if(loading) {

        // Fetch products from backend API
        axios.get('http://localhost:5000/api/products').then((res) => {
            setProducts(res.data);
            setLoading(false);
        })
    }
}
, [loading])
    
  return (
    <div className="w-full h-full ">
      
      {loading ?( <Loader />) :(
      <div className='w-full flex flex-wrap gap-[40px] mt-8 justify-center items-center '>{
        products.map((product) => (
            
                <ProductCard key={product.productId} product={product} />
            
            
        ))
    }
      </div>
        )}
        </div>
  );
      }

      

   