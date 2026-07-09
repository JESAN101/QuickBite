import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

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

    const loadingToast = toast.loading("Creating your account...");

    try {
      const data = await register(form);

      toast.dismiss(loadingToast);
      toast.success(data.message);

      navigate("/login");
    } catch (error) {
      console.log(error);

      toast.dismiss(loadingToast);

      toast.error(
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
          value={form.name}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          rows="3"
        />

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition duration-300"
        >
          Register
        </button>

        <p className="text-center mt-4">
          Already have an account?

          <Link
            to="/login"
            className="text-orange-500 ml-2 hover:underline"
          >
            Login
          </Link>

        </p>

      </form>

    </div>
  );
};

export default Register;