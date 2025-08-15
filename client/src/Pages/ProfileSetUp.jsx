import Avatar from 'react-avatar';
import { UserRoundPen } from 'lucide-react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileSetUp = () => {
  const username = localStorage.getItem("userName");
  const Loginbio = localStorage.getItem("bio");
  const avatar = localStorage.getItem("avatar");
  const userId = localStorage.getItem("userId"); 

  const [bio, setBio] = useState(Loginbio || '');
  const [avatarImage, setAvatarImage] = useState(avatar || null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate()

  const handleEditAvatar = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarImage(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!bio && !avatarImage) {
      alert("Please update bio or avatar first!");
      return;
    }

    const formData = new FormData();
    formData.append("bio", bio);
    if (avatarImage instanceof File) {
      formData.append("avatar", avatarImage);
    }

    try {
      const res = await fetch(`https://chatly-messenger-backend.onrender.com/${userId}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      console.log("Profile updated:", data);

      if (data.user) {
        localStorage.setItem("bio", data.user.bio || "");
        localStorage.setItem("avatar", data.user.avatar || "");
        setBio(data.user.bio || "");
        setAvatarImage(data.user.avatar || null);
      }

      alert("Profile saved successfully!");
      navigate('/users')
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-900 via-pink-700 to-blue-700 px-4">
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 flex flex-col items-center shadow-2xl border border-white/20">

        <div className="relative mb-6">
          <Avatar
            name={username}
            size="140"
            round={true}
            color="#8b5cf6"
            src={
              avatarImage instanceof File
                ? URL.createObjectURL(avatarImage)
                : avatarImage || null
            }
          />
          <UserRoundPen 
            className="absolute bottom-0 right-0 p-2 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
            size={30}
            onClick={handleEditAvatar} 
          />
        </div>

        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          style={{ display: 'none' }} 
        />

        <h1 className="text-3xl font-extrabold text-white mb-6">{username}</h1>

        <div className="w-full flex flex-col items-center">
          <label className="text-white/80 mb-2 font-semibold tracking-wide">Tell us about yourself</label>
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Your bio goes here..."
            className="w-full px-5 py-3 rounded-xl bg-white/20 placeholder-white/70 text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/30 transition-all duration-300"
          />
        </div>

        <button
          onClick={handleSaveProfile}
          className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileSetUp;
