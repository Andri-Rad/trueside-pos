'use client';
import { useState } from 'react';
import { db } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AdminPage() {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sizes, setSizes] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sizeArray = sizes.split(',').map(s => s.trim());

    try {
      await addDoc(collection(db, 'items'), {
        name,
        imageUrl,
        sizes: sizeArray,
        price: parseFloat(price),
        createdAt: new Date()
      });
      alert('Item added successfully!');
      setName('');
      setImageUrl('');
      setSizes('');
      setPrice('');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Add Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Available Sizes (e.g., S,M,L,XL)"
          value={sizes}
          onChange={e => setSizes(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Item
        </button>
      </form>
    </div>
  );
}
