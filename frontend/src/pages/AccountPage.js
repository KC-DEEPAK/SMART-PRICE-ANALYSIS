import { useState } from "react";
import "./AccountPage.css";

function AccountPage() {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [user, setUser] = useState(storedUser);
  const [photo, setPhoto] = useState(
    localStorage.getItem("profilePhoto")
  );

  // 📸 Handle photo upload
  const handlePhotoUpload = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem("profilePhoto", reader.result);
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="account-page">
      <div className="account-card">
        <h2>👤 My Account</h2>

        {/* PROFILE PHOTO */}
        <div className="profile-section">
          <img
            src={
              photo ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="Profile"
            className="profile-pic"
          />

          <label className="upload-btn">
            Change Photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhotoUpload}
            />
          </label>
        </div>

        {/* USER INFO */}
        <div className="info">
          <p><b>Name:</b> {user.name}</p>
          <p><b>Phone:</b> {user.phone}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Place:</b> {user.place}</p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default AccountPage;
