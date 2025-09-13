import { createBrowserRouter, RouterProvider } from "react-router";
import { UserProvider } from "./context/UserContextProvider";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import FarmerDashboard from "./pages/FarmerDashboard";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "marketplace", element: <Marketplace /> },
      { path: "farmer-dashboard", element: <FarmerDashboard /> },
      { path: "login", element: <Login /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
    ],
  },
]);

function App() {
  return (
    <CartProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </CartProvider>
  );
}

export default App;
