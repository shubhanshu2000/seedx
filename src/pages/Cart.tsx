import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, getTotal } = useCart();
  const navigate = useNavigate();
  const { user } = useUser();
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchImageUrls();
  }, [cart]);

  async function fetchImageUrls() {
    const urls: Record<number, string> = {};
    await Promise.all(
      cart
        .filter((item) => item.seed.image)
        .map(async (item) => {
          const { data: urlData } = await supabase.storage
            .from("seeds")
            .createSignedUrl(item.seed.image!, 3600); // 1 hour
          if (urlData) {
            urls[item.seed.id] = urlData.signedUrl;
          }
        })
    );
    setImageUrls(urls);
  }

  const handleQuantityChange = (id: number, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemove = (id: number) => {
    removeFromCart(id);
  };

  const handleBuy = () => {
    navigate("/checkout");
  };

  if (!user) {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-6">Your Cart</h2>
        <p className="text-gray-600">Please login to view your cart.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Login
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-6">Your Cart</h2>
        <p className="text-gray-600">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-green-800 mb-6">Your Cart</h2>
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.seed.id}
            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
          >
            <div className="flex items-center space-x-4">
              {item.seed.image ? (
                <img
                  src={
                    imageUrls[item.seed.id] ||
                    supabase.storage.from("seeds").getPublicUrl(item.seed.image)
                      .data.publicUrl
                  }
                  alt={item.seed.name}
                  className="w-20 h-20 object-cover rounded"
                />
              ) : null}
              <div>
                <h3 className="text-xl font-bold text-green-800">
                  {item.seed.name}
                </h3>
                <p className="text-gray-600">Price: ₹{item.seed.price}</p>
                <p className="text-gray-600">Farmer: {item.seed.farmer}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item.seed.id, Number(e.target.value))
                }
                className="w-16 px-2 py-1 border rounded"
              />
              <button
                onClick={() => handleRemove(item.seed.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right">
        <h3 className="text-2xl font-bold text-green-800">
          Total: ₹{getTotal()}
        </h3>
        <button
          onClick={handleBuy}
          className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default Cart;
