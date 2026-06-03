import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './App.css'
import AddProduct from './pages/admin/AddProduct'
import ViewProducts from './pages/admin/ViewProducts'

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/Login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/admin/addProduct" element={<AddProduct/>} />
        <Route path="/admin/viewProducts" element={<ViewProducts/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App