import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getProfile,
  updateProfile,
} from "../services/authService";

const Profile = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();

      setForm({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        address: data.user.address || "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile.");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const loadingToast = toast.loading("Updating profile...");

    try {
      const data = await updateProfile({
        name: form.name,
        phone: form.phone,
        address: form.address,
      });

      toast.dismiss(loadingToast);
      toast.success(data.message);

    } catch (error) {
      console.log(error);

      toast.dismiss(loadingToast);

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">

      <div className="bg-white shadow-xl rounded-2xl p-8">

        {/* Avatar */}

        <div className="flex flex-col items-center">

          <div className="w-24 h-24 rounded-full bg-orange-500 text-white flex items-center justify-center text-4xl font-bold">
            {form.name
              ? form.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <h1 className="text-3xl font-bold mt-4">
            My Profile
          </h1>

          <p className="text-gray-500">
            Manage your personal information
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >

          {/* Name */}

          <div>

            <label className="font-semibold block mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

          </div>

          {/* Email */}

          <div>

            <label className="font-semibold block mb-2">
              Email
            </label>

            <input
              type="email"
              value={form.email}
              disabled
              className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed"
            />

          </div>

          {/* Phone */}

          <div>

            <label className="font-semibold block mb-2">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

          </div>

          {/* Address */}

          <div>

            <label className="font-semibold block mb-2">
              Address
            </label>

            <textarea
              rows="4"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg text-lg font-semibold transition disabled:opacity-60"
          >
            {loading
              ? "Saving Changes..."
              : "Save Changes"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default Profile;