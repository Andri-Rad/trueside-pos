'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import jsPDF from 'jspdf';

type FormDataType = {
  name: string;
  email: string;
  address: string;
  phone: string;
  orders: {
    item: string;
    size: string;
    quantity: number;
    price: number;
  }[];
};

export default function TShirtForm() {
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    email: '',
    address: '',
    phone: '',
    orders: [{ item: '', size: '', quantity: 1, price: 0 }],
  });

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const snap = await getDocs(collection(db, 'items'));
      setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchItems();
  }, []);

  const handleOrderChange = (index: number, field: string, value: any) => {
    const newOrders = [...formData.orders];

    if (field === 'item') {
      const selectedItem = items.find(item => item.name === value);
      newOrders[index][field] = value;
      newOrders[index].price = selectedItem?.price || 0;
    } else {
      newOrders[index][field] = field === 'quantity' ? parseInt(value) : value;
    }

    setFormData({ ...formData, orders: newOrders });
  };

  const handleAddOrder = () => {
    setFormData({
      ...formData,
      orders: [...formData.orders, { item: '', size: '', quantity: 1, price: 0 }],
    });
  };

  const handleRemoveOrder = (index: number) => {
    const newOrders = [...formData.orders];
    newOrders.splice(index, 1);
    setFormData({ ...formData, orders: newOrders });
  };

  const getTotal = () =>
    formData.orders.reduce((total, o) => total + o.quantity * o.price, 0);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Order Receipt`, 10, 10);
    doc.text(`Name: ${formData.name}`, 10, 20);
    doc.text(`Email: ${formData.email}`, 10, 30);
    doc.text(`Phone: ${formData.phone}`, 10, 40);
    doc.text(`Address: ${formData.address}`, 10, 50);
    doc.text(`Items:`, 10, 60);

    let y = 70;
    formData.orders.forEach((order, i) => {
      doc.text(
        `${i + 1}. ${order.item} | Size: ${order.size} | Qty: ${order.quantity} | Price: Rp${order.price} | Subtotal: Rp${order.price * order.quantity}`,
        10,
        y
      );
      y += 10;
    });

    doc.text(`Total: Rp${getTotal()}`, 10, y + 10);
    doc.save('order-receipt.pdf');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addDoc(collection(db, 'orders'), {
      ...formData,
      total: getTotal(),
      timestamp: new Date().toISOString(),
    });

    generatePDF();

    alert('Order submitted!');
    setFormData({
      name: '',
      email: '',
      address: '',
      phone: '',
      orders: [{ item: '', size: '', quantity: 1, price: 0 }],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-4">
      <input
        type="text"
        placeholder="Name"
        className="w-full border p-2"
        required
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2"
        required
        value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })}
      />

      <input
        type="tel"
        placeholder="Phone"
        className="w-full border p-2"
        required
        value={formData.phone}
        onChange={e => setFormData({ ...formData, phone: e.target.value })}
      />

      <textarea
        placeholder="Address"
        className="w-full border p-2"
        required
        value={formData.address}
        onChange={e => setFormData({ ...formData, address: e.target.value })}
      />

      {formData.orders.map((order, index) => (
        <div key={index} className="border p-4 rounded space-y-2">
          <select
            className="w-full border p-2"
            value={order.item}
            onChange={e => handleOrderChange(index, 'item', e.target.value)}
            required
          >
            <option value="">Select Item</option>
            {items.map(item => (
              <option key={item.id} value={item.name}>
                {item.name} - Rp{item.price}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <select
              className="border p-2 w-1/2"
              value={order.size}
              onChange={e => handleOrderChange(index, 'size', e.target.value)}
              required
            >
              <option value="">Size</option>
              {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              className="border p-2 w-1/2"
              placeholder="Quantity"
              value={order.quantity}
              onChange={e => handleOrderChange(index, 'quantity', e.target.value)}
              required
            />
          </div>

          <div className="text-sm text-gray-600">
            Price: Rp{order.price} | Subtotal: Rp{order.price * order.quantity}
          </div>

          {formData.orders.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveOrder(index)}
              className="text-red-500 text-sm underline"
            >
              Remove Item
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddOrder}
        className="bg-gray-300 text-black px-4 py-2 rounded"
      >
        + Add Another Item
      </button>

      <div className="text-lg font-semibold">
        Total: Rp{getTotal()}
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit Order
      </button>
    </form>
  );
}
