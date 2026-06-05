import { Routes, Route } from "react-router-dom";
import Header from "../../components/Header";
import ProductsPage from "./ProductsPage";

export default function ClientHomePage() {
  return (
    <div className="w-full h-screen">
      <Header />
      <div className='w-full h-[calc(100vh-100px)]' >
        <Routes>
          <Route
            path="/"
            element={
              <h1 className="text-black text-4xl font-bold flex justify-center items-center h-full">Welcome to the Client Home Page</h1>
            }
          />
          <Route
            path="/products"
            element={
              <ProductsPage />
            }
          />
          <Route
            path="/reviews"
            element={
              <h1 className="text-black text-4xl font-bold flex justify-center items-center h-full">Reviews Page</h1>
            }
          />
          <Route
            path="/contact-us"
            element={
              <h1 className="text-black text-4xl font-bold flex justify-center items-center h-full">Contact Us Page</h1>
            }
          />
          <Route
            path="/about-us"
            element={
              <h1 className="text-black text-4xl font-bold flex justify-center items-center h-full">About Us Page</h1>
            }
          />
          <Route
            path="/*"
            element={
              <h1 className="text-black text-4xl font-bold flex justify-center items-center h-full">404 - Page Not Found</h1>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
    