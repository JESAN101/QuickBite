import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getMyRestaurant,
  updateMyRestaurant,
} from "../services/restaurantService";

const RestaurantProfile = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
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
        name: rest.name,
        description: rest.description,
        address: rest.address,
        phone: rest.phone,
        isOpen: rest.isOpen,
      });

      if (rest.image) {
        setPreview(
          `http://localhost:5000/uploads/${rest.image}`
        );
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
        error.response?.data?.message ||
          "Failed to update restaurant."
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
          : "Restaurant is now closed."
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to update open status.");
    }
  };

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center h-full text-xl">
        Loading...
      </div>
    );
  }

  const inputClass =
    "w-full border rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-orange-500";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Restaurant Profile
        </h1>

        <p className="text-gray-500 mt-2">
          Update your restaurant details
        </p>
      </div>

      {/* Open / Close Toggle */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">
            {formData.isOpen ? "Restaurant is Open" : "Restaurant is Closed"}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Customers can only see your restaurant when it's open.
          </p>
        </div>

        <button
          onClick={handleToggleOpen}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            formData.isOpen
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          {formData.isOpen ? "Close Now" : "Open Now"}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        <div>
          <label className="font-semibold">
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
          <label className="font-semibold">
            Description
          </label>

          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold">
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

          <div>
            <label className="font-semibold">
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
        </div>

        <div>
          <label className="font-semibold block mb-3">
            Restaurant Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded-lg p-3"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 w-44 h-44 object-cover rounded-xl border shadow"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default RestaurantProfile;
