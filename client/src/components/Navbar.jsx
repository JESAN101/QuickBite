import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, getUser, logout } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();

  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 40px",
        background: "#ff4d4d",
        color: "white",
      }}
    >
      <h2>QuickBite</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Home
        </Link>

        <Link to="/cart" style={{ color: "white", textDecoration: "none" }}>
          Cart
        </Link>

        <Link to="/orders" style={{ color: "white", textDecoration: "none" }}>
          Orders
        </Link>

        <Link to="/profile" style={{ color: "white", textDecoration: "none" }}>
          Profile
        </Link>

        <Link to="/favorites" style={{ color: "white" }}>
  Favorites
</Link>

        {!isLoggedIn() ? (
          <>
            <Link
              to="/login"
              style={{ color: "white", textDecoration: "none" }}
            >
              Login
            </Link>

            <Link
              to="/register"
              style={{ color: "white", textDecoration: "none" }}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <span>
              Hello, <b>{user?.name}</b>
            </span>

            <button
              onClick={handleLogout}
              style={{
                background: "white",
                color: "#ff4d4d",
                border: "none",
                padding: "6px 14px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;