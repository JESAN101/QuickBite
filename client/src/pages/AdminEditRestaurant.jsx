import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import RestaurantForm from "../components/admin/RestaurantForm";

import {
  getRestaurantById,
  updateRestaurant,
} from "../services/restaurantService";
import { getAllUsers } from "../services/adminService";

const AdminEditRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState({});
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRestaurant();
    fetchRestaurantOwners();
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

  const fetchRestaurantOwners = async () => {
    try {
      const data = await getAllUsers();

      setOwners(
        (data.users || []).filter(
          (user) => user.role === "restaurant"
        )
      );
    } catch (error) {
      console.log(error);
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
    <>
      <h1 className="text-4xl font-bold mb-8">
        ✏ Edit Restaurant
      </h1>

      <RestaurantForm
        initialData={restaurant}
        owners={owners}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </>
  );
};

export default AdminEditRestaurant;
