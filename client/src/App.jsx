import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './pages/Login'
import Contact from './pages/Contact'
import VendorProfile from './pages/vendorProfile'
import Upload from './pages/Upload'
import History from './pages/History'
import SearchVendors from './pages/SearchVendors'
import Dashboard from './pages/Dashboard'
import VendorInfoPage from './pages/VendorInfoPage'
import LocationTracker from './pages/LocationTracker'
import Rewards from './pages/Rewards'
import Shop from './pages/Shop'
import Reedeem from './pages/Reedeem'
import PrivateRoute from './components/PrivateRoute'


export default function App() {
  return (
    <BrowserRouter>
    <Header></Header>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route element={<PrivateRoute></PrivateRoute>}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/vendor/profile" element={<VendorProfile />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/history" element={<History />} />
        <Route path="/search-vendors" element={<SearchVendors />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vendor/:id" element={<VendorInfoPage />} />
        <Route path="/location-tracker" element={<LocationTracker />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/reedeem" element={<Reedeem />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
    <Footer></Footer>
    </BrowserRouter>
  )
}