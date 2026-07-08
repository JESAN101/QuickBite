import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await register(form);

      alert(data.message);

      navigate("/login");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );

    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md"
      >

        <h2 className="text-3xl font-bold mb-6 text-center">
          Create Account
        </h2>

        <input
          name="name"
          placeholder="Full Name"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Address"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        />

        <button
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
        >
          Register
        </button>

        <p className="text-center mt-4">
          Already have an account?

          <Link
            to="/login"
            className="text-orange-500 ml-2"
          >
            Login
          </Link>

        </p>

      </form>

    </div>
  );
};

export default Register;