import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className='h-[100px] bg-blue-500 mb-4 flex justify-center items-center'>
        <Link to="/" className='text-white text-2xl font-bold'>Home</Link>
        <Link to="/client"className='text-white text-2xl font-bold ml-4'>Client</Link>
        <Link to="/reviews" className='text-white text-2xl font-bold ml-4'>Reviews</Link>   
        <Link to="/Login" className='text-white text-2xl font-bold ml-4'>Login</Link>
        <Link to="/register" className='text-white text-2xl font-bold ml-4'>Register</Link>
        <Link to="/products" className='text-white text-2xl font-bold ml-4'>Products</Link>
    
        
        </header>
  );
}
