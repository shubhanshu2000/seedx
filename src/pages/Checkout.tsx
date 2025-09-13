import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const Checkout: React.FC = () => {
  const { cart, getTotal, clearCart } = useCart();
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

  const handlePayment = () => {
    // Mock payment process
    alert("Payment successful! Thank you for your purchase.");
    clearCart();
  };

  if (cart.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-6">Checkout</h2>
        <p className="text-gray-600">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-green-800 mb-6">Checkout</h2>
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
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-gray-600">Price: ₹{item.seed.price}</p>
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-green-800">
                ₹{item.seed.price * item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right">
        <h3 className="text-2xl font-bold text-green-800">
          Total: ₹{getTotal()}
        </h3>
        <button
          onClick={handlePayment}
          className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Checkout;
