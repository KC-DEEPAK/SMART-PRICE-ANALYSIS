import { useAuth } from "../context/AuthContext";

function AccountPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return <h3>Please login</h3>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>👤 My Account</h2>

      <p><b>Name:</b> {user.name}</p>
      <p><b>Phone:</b> {user.phone}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Place:</b> {user.place}</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default AccountPage;
