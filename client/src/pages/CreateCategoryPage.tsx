import React from 'react';
import { useState } from 'react';

export default function CreateCategoryPage() {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    shopSlug: ''
  });

  const [result, setResult] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed');
      }

      const data = await res.json();
      setResult(`✅ Created: ${data.name}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setResult(`❌ Error: ${err.message}`);
      } else {
        setResult('❌ Error: An unknown error occurred');
      }
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Create Category</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input type="text" name="slug" placeholder="Slug" value={form.slug} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input type="text" name="shopSlug" placeholder="Shop Slug" value={form.shopSlug} onChange={handleChange} required />
        <button type="submit">Create</button>
        {result && <p>{result}</p>}
      </form>
    </div>
  );
}