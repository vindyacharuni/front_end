import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminRoute from './components/AdminRoute' // Import the new guard
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AddProduct from './pages/admin/AddProduct'
import ViewProducts from './pages/admin/ViewProducts'
import AdminHomePage from './pages/admin/AdminHomePage'
import EditProduct from './pages/admin/EditProduct'
import ClientHomePage from './pages/client/ClientHomePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🔒 Protect all Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminHomePage />} />
          <Route path="/admin/addProduct" element={<AddProduct />} />
          <Route path="/admin/viewProducts" element={<ViewProducts />} />
          <Route path="/admin/editProduct" element={<EditProduct />} />
          <Route path="/admin/editProduct/:id" element={<EditProduct />} />
        </Route>

        <Route path="/*" element={<ClientHomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
