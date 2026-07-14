import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getProfile, updateProfile } from "../services/authService";

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

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
    setForm({ ...form, [e.target.name]: e.target.value });
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
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <div className="rounded-2xl border border-[#EADFC8] bg-[#FFFBF3] p-8 shadow-[0_10px_30px_-12px_rgba(29,21,18,0.15)] sm:p-10">
        {/* header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F0A438] font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold text-[#1D1512]">
            {getInitials(form.name)}
          </div>

          <h1 className="mt-5 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-[#1D1512]">
            My{" "}
            <span className="font-['Fraunces',serif] italic font-normal text-[#D64933]">
              Profile
            </span>
          </h1>
          <p className="mt-1 text-sm text-[#3A2A20]/55">
            Manage your personal information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1D1512]">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#EADFC8] bg-white p-3 text-[#1D1512] outline-none transition focus:border-[#F0A438] focus:ring-2 focus:ring-[#F0A438]/25"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1D1512]">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-[#EADFC8] bg-[#EADFC8]/30 p-3 text-[#3A2A20]/60"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1D1512]">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#EADFC8] bg-white p-3 text-[#1D1512] outline-none transition focus:border-[#F0A438] focus:ring-2 focus:ring-[#F0A438]/25"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1D1512]">
              Address
            </label>
            <textarea
              rows="4"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#EADFC8] bg-white p-3 text-[#1D1512] outline-none transition focus:border-[#F0A438] focus:ring-2 focus:ring-[#F0A438]/25"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#1D1512] py-3.5 text-lg font-semibold text-[#F7ECD9] transition hover:bg-[#F0A438] hover:text-[#1D1512] disabled:opacity-60"
          >
            {loading ? "Saving changes…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;