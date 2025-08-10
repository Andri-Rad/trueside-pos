"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation"; // <-- Added

type Item = {
  id: string;
  name: string;
  price: number;
  sizes: string[];
  imageUrl: string;
};

export default function AdminViewItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter(); // <-- Added

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "items"));
        const fetchedItems: Item[] = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Partial<Item>;
          return {
            id: docSnap.id,
            name: data.name ?? "",
            price: Number(data.price) || 0,
            sizes: Array.isArray(data.sizes)
              ? data.sizes.map((s) => String(s))
              : [],
            imageUrl: data.imageUrl ?? "",
          };
        });
        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleUpdate = async (index: number) => {
    const item = items[index];
    try {
      const itemRef = doc(db, "items", item.id);
      await updateDoc(itemRef, {
        name: item.name,
        price: item.price,
        sizes: item.sizes,
        imageUrl: item.imageUrl,
      });
      alert("Item updated successfully.");
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteDoc(doc(db, "items", id));
      setItems((prev) => prev.filter((item) => item.id !== id));
      alert("Item deleted.");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item.");
    }
  };

  const handleInputChange = <K extends keyof Item>(
    index: number,
    field: K,
    value: Item[K]
  ) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Back button */}
      <button
        onClick={() => router.push("/admin")}
        className="mb-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-4">All Items</h1>

      <input
        type="text"
        placeholder="Search items..."
        className="border px-3 py-2 mb-6 rounded w-full md:w-1/2"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="space-y-6">
        {filteredItems.map((item, index) => (
          <div key={item.id} className="border p-4 rounded-md shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="font-semibold">Name:</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                  className="w-full border px-3 py-2 mt-1 rounded"
                />
              </div>
              <div>
                <label className="font-semibold">Price (IDR):</label>
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) =>
                    handleInputChange(index, "price", Number(e.target.value))
                  }
                  className="w-full border px-3 py-2 mt-1 rounded"
                />
              </div>
              <div>
                <label className="font-semibold">
                  Available Sizes (comma-separated):
                </label>
                <input
                  type="text"
                  value={item.sizes.join(",")}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      "sizes",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  className="w-full border px-3 py-2 mt-1 rounded"
                />
              </div>
              <div>
                <label className="font-semibold">Image URL:</label>
                <input
                  type="text"
                  value={item.imageUrl}
                  onChange={(e) =>
                    handleInputChange(index, "imageUrl", e.target.value)
                  }
                  className="w-full border px-3 py-2 mt-1 rounded"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="max-h-40 object-contain mt-2 rounded border"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleUpdate(index)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
