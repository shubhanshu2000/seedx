import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "../context/UserContext";

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

const FarmerDashboard: React.FC = () => {
  const { user } = useUser();
  const [seed, setSeed] = useState<Omit<Seed, "id">>({
    name: "",
    quality: "",
    price: 0,
    farmer: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [mySeeds, setMySeeds] = useState<Seed[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({});
  const [verifying, setVerifying] = useState(false);

  const verifyQuality = async () => {
    if (!imageFile) {
      alert("Please upload an image to verify quality.");
      return;
    }
    setVerifying(true);
    // Mock AI verification: simulate processing
    setTimeout(() => {
      // In real implementation, send image to AI model
      const qualities = ["High Quality", "Medium Quality", "Low Quality"];
      const randomQuality =
        qualities[Math.floor(Math.random() * qualities.length)];
      setSeed({ ...seed, quality: randomQuality });
      setVerifying(false);
      alert(`AI Verification Complete: ${randomQuality}`);
    }, 2000); // Simulate 2 second processing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("User not authenticated");
      return;
    }
    let imageUrl = "";
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `public/${Math.random()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("seeds")
        .upload(fileName, imageFile);
      if (uploadError) {
        alert("Error uploading image: " + uploadError.message);
        return;
      }
      imageUrl = data?.path || "";
    }
    const seedToInsert = {
      name: seed.name,
      quality: seed.quality,
      price: seed.price,
      farmer: user.user_metadata?.full_name || "Unknown",
      image: imageUrl,
    };
    const { error } = await supabase.from("seeds").insert([seedToInsert]);
    if (error) {
      console.error("Error adding seed:", error);
    } else {
      alert("Seed added successfully!");
      setSeed({
        name: "",
        quality: "",
        price: 0,
        farmer: "",
      });
      setImageFile(null);
      fetchMySeeds();
    }
  };

  const fetchMySeeds = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("seeds")
      .select()
      .eq("farmer", user.user_metadata?.full_name || "");
    if (error) {
      console.error("Error fetching your seeds:", error);
    } else {
      setMySeeds(data);
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
  };

  useEffect(() => {
    if (user) {
      fetchMySeeds();
    }
  }, [user]);

  return (
    <div>
      <h2 className="text-3xl font-bold text-green-800 mb-6">
        Farmer Dashboard
      </h2>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-green-700 mb-4">
          Add New Seed
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Seed Name"
            value={seed.name}
            onChange={(e) => setSeed({ ...seed, name: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Quality"
            value={seed.quality}
            onChange={(e) => setSeed({ ...seed, quality: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            placeholder="Price"
            value={seed.price}
            onChange={(e) =>
              setSeed({ ...seed, price: parseFloat(e.target.value) })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
            className="w-full py-2"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={verifyQuality}
              disabled={verifying || !imageFile}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              {verifying ? "Verifying..." : "Verify Quality with AI"}
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
              Add Seed
            </button>
          </div>
        </form>
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-green-700 mb-4">My Seeds</h3>
        {mySeeds.length === 0 ? (
          <p className="text-gray-500">No seeds added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mySeeds.map((s) => (
              <div key={s.id} className="bg-white p-4 rounded-lg shadow-md">
                {s.image ? (
                  <img
                    src={
                      imageUrls[s.id] ||
                      supabase.storage.from("seeds").getPublicUrl(s.image).data
                        .publicUrl
                    }
                    alt={s.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                ) : null}
                <h4 className="text-xl font-bold text-green-800">{s.name}</h4>
                <p className="text-gray-600">Quality: {s.quality}</p>
                <p className="text-gray-600">Price: ₹{s.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;
