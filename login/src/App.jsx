import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dash from "./pages/Dash";
import Orders from "./components/Orders";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import Protected from "./components/Protected";

const MainLayout = ({ children }) => {
  const location = useLocation();
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
  const isAdmin = true;

  return (
    <CartProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<Login isAdmin={true} />} />
            <Route path="/" element={<Protected />}>
              <Route path="/" element={<Dash />} />
              <Route path="/orders" element={<Orders />} /> {/* ✅ No more userId prop */}
              <Route path="/cart" element={<Cart />} />
            </Route>
            {isAdmin ? (
              <Route path="/admin" element={<AdminDashboard />} />
            ) : (
              <Route path="/admin" element={<h2>Unauthorized Access</h2>} />
            )}
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
