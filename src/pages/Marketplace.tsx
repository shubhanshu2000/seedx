import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useCart } from "../context/CartContext";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

interface Seed {
  id: number;
  name: string;
  quality: string;
  price: number;
  farmer: string;
  image?: string;
}

const Marketplace: React.FC = () => {
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({});

  // Remove unused imageUrls state and signed URL fetching since not used in rendering
  const { addToCart } = useCart();

  useEffect(() => {
    fetchSeeds();
  }, []);

  async function fetchSeeds() {
    const { data, error } = await supabase.from("seeds").select();
    if (error) {
      console.error("Error fetching seeds:", error);
    } else {
      setSeeds(data);
      // Fetch signed URLs for images
      const urls: Record<number, string> = {};
      await Promise.all(
        data
          .filter((seed) => seed.image)
          .map(async (seed) => {
            const { data: urlData } = await supabase.storage
              .from("seeds")
              .createSignedUrl(seed.image!, 3600); // 1 hour
            if (urlData) {
              urls[seed.id] = urlData.signedUrl;
            }
          })
      );
      setImageUrls(urls);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold text-green-800 mb-8 text-center">
        🌱 Marketplace
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {seeds.map((seed) => (
          <div
            key={seed.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            {/* Seed Image Placeholder */}
            {seed.image && imageUrls[seed.id] ? (
              <img
                src={imageUrls[seed.id]}
                alt={seed.name}
                className="h-40 w-full object-cover rounded-t-2xl"
              />
            ) : (
              <div className="h-40 bg-green-100 rounded-t-2xl flex items-center justify-center text-green-700 font-bold text-lg">
                {seed.name}
              </div>
            )}

            {/* Card Content */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{seed.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Quality: <span className="font-medium">{seed.quality}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Farmer: <span className="font-medium">{seed.farmer}</span>
                </p>
                <p className="text-lg font-semibold text-green-700 mt-2">
                  ₹{seed.price}
                </p>
              </div>

              {/* Quantity + Add to Cart */}
              <div className="mt-4 flex items-center space-x-3">
                <div className="flex items-center border rounded-lg">
                  <button
                    className="px-3 py-1 text-lg text-gray-600 hover:text-green-700"
                    onClick={() => {
                      const input = document.getElementById(
                        `quantity-${seed.id}`
                      ) as HTMLInputElement;
                      if (Number(input.value) > 1)
                        input.value = `${Number(input.value) - 1}`;
                    }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="w-14 text-center border-l border-r py-1 outline-none"
                    id={`quantity-${seed.id}`}
                  />
                  <button
                    className="px-3 py-1 text-lg text-gray-600 hover:text-green-700"
                    onClick={() => {
                      const input = document.getElementById(
                        `quantity-${seed.id}`
                      ) as HTMLInputElement;
                      input.value = `${Number(input.value) + 1}`;
                    }}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => {
                    const qty = Number(
                      (
                        document.getElementById(
                          `quantity-${seed.id}`
                        ) as HTMLInputElement
                      ).value
                    );
                    addToCart(seed, qty);
                    alert(`Added ${qty} ${seed.name} to cart`);
                  }}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
