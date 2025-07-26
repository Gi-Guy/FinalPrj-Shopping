import React, { useEffect, useState } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  location?: string;
  bio?: string;
  avatar?: string;
};

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    location: '',
    bio: '',
    avatar: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data: User) => {
        setUser(data);
        setForm({
          name: data.name,
          email: data.email,
          location: data.location || '',
          bio: data.bio || '',
          avatar: data.avatar || '',
        });
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch user:', err);
        localStorage.removeItem('token');
        setUser(null);
        setIsLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      const updatedUser: User = await res.json();
      setUser(updatedUser);
      setEditMode(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>No user connected. Please log in!</div>;

  return (
    <div className="user-profile">
      <h2>User Profile</h2>

      {editMode ? (
        <div className="form">
          <input name="name" value={form.name} onChange={handleChange} />
          <input name="email" value={form.email} onChange={handleChange} />
          <input name="location" value={form.location} onChange={handleChange} />
          <input name="bio" value={form.bio} onChange={handleChange} />
          <input name="avatar" value={form.avatar} onChange={handleChange} />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div className="info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Location:</strong> {user.location || 'N/A'}</p>
          <p><strong>Bio:</strong> {user.bio || 'N/A'}</p>
          {user.avatar && <img src={user.avatar} alt="Avatar" width="100" />}
          <button onClick={() => setEditMode(true)}>Edit</button>
        </div>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
