import React from 'react';
import { useState } from 'react';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import Button from '../components/Button';

export default function CreateShopForm() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    workingHours: '',
    ownerId: 1
  });

  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('http://localhost:3001/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Request failed');

      const data = await res.json();
      setStatus('success');
      console.log('Created shop:', data);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <main>
      <h1>Create New Shop</h1>
      <form onSubmit={handleSubmit}>
        <Input name="name" placeholder="Shop name" value={form.name} onChange={handleChange} />
        <TextArea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <Input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
        <Input name="workingHours" placeholder="Working Hours" value={form.workingHours} onChange={handleChange} />
        <Button type="submit">Create</Button>
      </form>
      {status === 'loading' && <p>Creating shop...</p>}
      {status === 'success' && <p>✅ Shop created successfully</p>}
      {status === 'error' && <p>❌ Error creating shop</p>}
    </main>
  );
}