// import { CartProvider } from "./context/CartContext";
import CartProvider from "./context/CartContext";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Dash from "./pages/Dash";
import Orders from "./components/Orders"; // Adjusted import path for consistency
import Cart from "./pages/Cart";
import Protected from "./components/Protected";
import "./app.css";

// Component to conditionally render Navbar
const MainLayout = ({ children }) => {
  const location = useLocation();

  // Do not render Navbar on the login page
  if (location.pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

const App = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/" element={<Protected />}>
              <Route path="/" element={<Dash />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/cart" element={<Cart />} />
            </Route>
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;