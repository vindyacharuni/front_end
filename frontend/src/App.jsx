import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './App.css'
import AddProduct from './pages/admin/AddProduct'
import ViewProducts from './pages/admin/ViewProducts'
import AdminHomePage from './pages/admin/AdminHomePage'
import EditProduct from './pages/admin/EditProduct'
import ClientHomePage from './pages/client/ClientHomePage'
import Header from './components/Header'

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/Login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/admin/addProduct" element={<AddProduct/>} />
        <Route path="/admin/viewProducts" element={<ViewProducts/>} />
        <Route path="/admin" element={<AdminHomePage/>} />
        <Route path="/admin/editProduct" element={<EditProduct/>} />
        <Route path="/admin/editProduct/:id" element={<EditProduct/>} />
        <Route path="/*" element={<ClientHomePage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App