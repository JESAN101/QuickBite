import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { login } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading("Logging in...");

    try {
      const data = await login(form);

      // Save Token
      localStorage.setItem("token", data.token);

      // Save User
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      toast.dismiss(loadingToast);
      toast.success(data.message);

      navigate("/");
    } catch (error) {
      console.log(error);

      toast.dismiss(loadingToast);

      toast.error(
        error.response?.data?.message ||
          "Login Failed"
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
          Welcome Back
        </h2>

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
          className="w-full border p-3 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition duration-300"
        >
          Login
        </button>

        <p className="text-center mt-4">
          Don't have an account?

          <Link
            to="/register"
            className="text-orange-500 ml-2 hover:underline"
          >
            Register
          </Link>

        </p>

      </form>

    </div>
  );
};

export default Login;