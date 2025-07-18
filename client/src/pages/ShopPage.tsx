import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

type Shop = {
  id: number;
  name: string;
  description: string;
  slug: string;
  is_active: boolean;
  location: string;
  working_hours: string;
  created_at: string;
};

export default function ShopPage() {
  const { slug } = useParams<{ slug: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;

    fetch(`http://localhost:3001/api/shops/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Shop not found');
        return res.json();
      })
      .then((data) => {
        setShop(data);
        setError('');
      })
      .catch((err) => {
        setError(err.message);
        setShop(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p>Loading shop...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!shop) return <p>No shop found.</p>;

  return (
    <div>
      <h1>{shop.name}</h1>
      <p><strong>Description:</strong> {shop.description}</p>
      <p><strong>Location:</strong> {shop.location}</p>
      <p><strong>Working Hours:</strong> {shop.working_hours}</p>
      <p><strong>Status:</strong> {shop.is_active ? 'Active' : 'Inactive'}</p>
      <p><strong>Created At:</strong> {new Date(shop.created_at).toLocaleDateString()}</p>
    </div>
  );
}
