import React, { useEffect, useState } from 'react';
import './UserProfile.scss';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
  location: string;
  bio: string;
  avatar: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/user/1')
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setTempUser(data);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!tempUser) return;
    setTempUser(prev => ({ ...prev!, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setTempUser(prev => ({ ...prev!, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!tempUser) return;
    fetch('http://localhost:3001/api/user/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tempUser),
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setTempUser(data);
        setEditMode(false);
      });
  };

  const handleCancel = () => {
    setTempUser(user);
    setEditMode(false);
  };

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  if (!user || !tempUser) return <div className="profile-container">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src={tempUser.avatar} alt="User Avatar" className="avatar" />

        {editMode ? (
          <>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />

            <input
              type="text"
              name="name"
              value={tempUser.name}
              onChange={handleChange}
              placeholder="Name"
            />
            <input
              type="email"
              name="email"
              value={tempUser.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              type="text"
              name="location"
              value={tempUser.location}
              onChange={handleChange}
              placeholder="Location"
            />
            <textarea
              name="bio"
              value={tempUser.bio}
              onChange={handleChange}
              placeholder="Bio"
            />
            <div className="button-group">
              <button onClick={handleSave}>💾 Save</button>
              <button onClick={handleCancel}>✖ Cancel</button>
            </div>
          </>
        ) : (
          <>
            <h2>{user.name}</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Location:</strong> {user.location}</p>
            <p className="bio">{user.bio}</p>
            <button onClick={() => setEditMode(true)}>✏ Edit</button>
            <button onClick={handleCreatePost}>📝 Create Post</button>
          </>
        )}
      </div>
    </div>
  );
}
