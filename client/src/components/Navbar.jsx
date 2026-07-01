import { Link } from "react-router-dom";

const Navbar = () => {
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
        <Link to="/" style={{ color: "white" }}>
          Home
        </Link>

        <Link to="/cart" style={{ color: "white" }}>
          Cart
        </Link>

        <Link to="/orders" style={{ color: "white" }}>
          Orders
        </Link>

        <Link to="/profile" style={{ color: "white" }}>
          Profile
        </Link>

        <Link to="/login" style={{ color: "white" }}>
          Login
        </Link>

        <Link to="/register" style={{ color: "white" }}>
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;