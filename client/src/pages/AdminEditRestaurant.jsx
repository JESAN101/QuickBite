import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import RestaurantForm from "../components/admin/RestaurantForm";

import {
  getRestaurantById,
  updateRestaurant,
} from "../services/restaurantService";

const AdminEditRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    try {
      const data = await getRestaurantById(id);
      setRestaurant(data.restaurant);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load restaurant.");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      const data = await updateRestaurant(id, formData);

      toast.success(data.message);

      navigate("/admin/restaurants");

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to update restaurant."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!restaurant._id) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Loading Restaurant...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        ✏ Edit Restaurant
      </h1>

      <RestaurantForm
        initialData={restaurant}
        onSubmit={handleSubmit}
        loading={loading}
      />

    </div>
  );
};

export default AdminEditRestaurant;