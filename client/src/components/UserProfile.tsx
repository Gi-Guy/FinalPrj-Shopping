import React, { useState } from 'react';
import './UserProfile.scss';

interface User {
  name: string;
  email: string;
  location: string;
  bio: string;
  avatar: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<User>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    location: 'New York, USA',
    bio: 'Web developer who loves coffee and coding.',
    avatar: 'https://i.pravatar.cc/150?img=3',
  });

  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState<User>(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempUser(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setUser(tempUser);
    setEditMode(false);
  };

  const handleCancel = () => {
    setTempUser(user);
    setEditMode(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src={tempUser.avatar} alt="User Avatar" className="avatar" />

        {editMode ? (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
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
          </>
        )}
      </div>
    </div>
  );
}
