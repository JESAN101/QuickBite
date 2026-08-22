import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaStore, FaSave } from "react-icons/fa";

import {
  getMyRestaurant,
  updateMyRestaurant,
} from "../services/restaurantService";
import { getImageUrl } from "../utils/image";

const RestaurantProfile = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    cuisineType: "",
    openingTime: "",
    closingTime: "",
    estimatedDeliveryTime: "",
    licenseNumber: "",
    isOpen: true,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRestaurant = async () => {
    try {
      const data = await getMyRestaurant();
      const rest = data.restaurant;

      setRestaurant(rest);
      setFormData({
        name: rest.name || "",
        description: rest.description || "",
        address: rest.address || "",
        phone: rest.phone || "",
        email: rest.email || "",
        cuisineType: rest.cuisineType || "",
        openingTime: rest.openingTime || "",
        closingTime: rest.closingTime || "",
        estimatedDeliveryTime: rest.estimatedDeliveryTime || "",
        licenseNumber: rest.licenseNumber || "",
        isOpen: rest.isOpen,
      });

      if (rest.image) {
        setPreview(getImageUrl(rest.image));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load restaurant.");
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (image) {
        data.append("image", image);
      }

      const response = await updateMyRestaurant(data);
      toast.success(response.message);
      fetchRestaurant();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update restaurant.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOpen = async () => {
    try {
      const data = new FormData();
      data.append("isOpen", String(!formData.isOpen));

      const response = await updateMyRestaurant(data);

      setFormData((prev) => ({
        ...prev,
        isOpen: !prev.isOpen,
      }));

      toast.success(
        response.restaurant.isOpen
          ? "Restaurant is now open."
          : "Restaurant is now closed.",
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to update open status.");
    }
  };

  if (!restaurant) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
          <p className="text-gray-500">Loading Restaurant...</p>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 lg:text-4xl">
          Restaurant Profile
        </h1>
        <p className="mt-1 text-gray-500">
          Update your restaurant details and business information
        </p>
      </div>

      {/* Open / Close Toggle */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${
                formData.isOpen ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              <FaStore className="text-lg" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">
                {formData.isOpen
                  ? "Restaurant is Open"
                  : "Restaurant is Closed"}
              </h3>
              <p className="text-sm text-gray-500">
                Customers can only see your restaurant when it's open.
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleOpen}
            className={`rounded-xl px-6 py-3 text-sm font-bold transition ${
              formData.isOpen
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {formData.isOpen ? "Close Now" : "Open Now"}
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100"
      >
        <div className="space-y-6">
          {/* Restaurant Details */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">
              Restaurant Details
            </h3>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Cuisine Type
                  </label>
                  <input
                    type="text"
                    name="cuisineType"
                    value={formData.cuisineType}
                    onChange={handleChange}
                    placeholder="e.g. Nepali, Chinese"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  rows="3"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">
              Contact Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="info@restaurant.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Hours & Delivery */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">
              Hours & Delivery
            </h3>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Opening Time
                </label>
                <input
                  type="time"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Closing Time
                </label>
                <input
                  type="time"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Est. Delivery (min)
                </label>
                <input
                  type="number"
                  name="estimatedDeliveryTime"
                  value={formData.estimatedDeliveryTime}
                  onChange={handleChange}
                  min="1"
                  placeholder="30"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* License & Image */}
          <div className="border-t border-gray-100 pt-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="e.g. FSSAI / business license"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Restaurant Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm"
                />
              </div>
            </div>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 h-40 w-56 rounded-xl object-cover ring-1 ring-gray-200"
              />
            )}
          </div>

          {/* Submit */}
          <div className="border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/25 transition hover:bg-orange-600 disabled:opacity-60"
            >
              <FaSave />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RestaurantProfile;
