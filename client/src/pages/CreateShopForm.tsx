import React, { useState, useEffect } from 'react';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import Button from '../components/Button';
import '../components/CreateShopForm.scss';

export default function CreateShopForm() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    workingHours: '',
    owner_id: 0, // backend expects snake_case
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) return;

    setToken(savedToken);

    // Fetch user info to get owner_id
    fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${savedToken}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(user => {
        setForm(prev => ({ ...prev, owner_id: user.id }));
      })
      .catch(err => {
        console.error('Failed to get user info:', err);
        localStorage.removeItem('token');
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/shops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || 'Request failed');
      }

      const data = await res.json();
      setStatus('success');
      console.log('Created shop:', data);

      // Optional: reset form
      setForm({
        name: '',
        description: '',
        location: '',
        workingHours: '',
        owner_id: form.owner_id,
      });
    } catch (err) {
      console.error('Create shop error:', err);
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
      {status === 'error' && <p style={{ color: 'red' }}>❌ Error creating shop</p>}
    </main>
  );
}
