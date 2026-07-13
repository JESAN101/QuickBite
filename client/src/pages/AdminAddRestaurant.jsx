import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import RestaurantForm from "../components/admin/RestaurantForm";
import { createRestaurant } from "../services/restaurantService";

const AdminAddRestaurant = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      const data = await createRestaurant(formData);

      toast.success(data.message);

      navigate("/admin/restaurants");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create restaurant."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8">
        ➕ Add Restaurant
      </h1>

      <RestaurantForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default AdminAddRestaurant;