import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
// import Cart from './Pages/Cart';
import Product from './Pages/Product';
import LoginSignup from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import banner_1 from './Components/Assets/banner-1.jpg';
import banner_2 from './Components/Assets/banner_2.jpg';
import banner_3 from './Components/Assets/banner_3.jpg';
import Admin from './Components/Admin/AdminPage';
import AddProductForm from './Components/Admin/AddProductForm';
import ProductDisplay from './Components/ProductDisplay/ProductDisplay';
import Cartpage from './Pages/CartPage'
//import CartPage from './CartPage'; // Adjust the import path

const App = () => {
 // const { user } = useContext(CartContext);

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/men" element={<ShopCategory banner={banner_1} category="men" />} />
          <Route path="/women" element={<ShopCategory banner={banner_2} category="women" />} />
          <Route path="/kids" element={<ShopCategory banner={banner_3} category="kid" />} />
          <Route path="/product" element={<Product />}>
            <Route path=":productId" element={<Product />} />
          </Route>
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/productform" element={<AddProductForm />} />
          {/* Admin route accessible to all users */}
          <Route path="/admin" element={<Admin />} />
        <Route path= "/productshow" element={<ProductDisplay/>}/>
        <Route path='/cartpage' element={<Cartpage/>}/>
        
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
