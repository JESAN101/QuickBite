import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import RestaurantForm from "../components/admin/RestaurantForm";
import { createRestaurant } from "../services/restaurantService";
import { getAllUsers } from "../services/adminService";

const AdminAddRestaurant = () => {
  const navigate = useNavigate();

  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRestaurantOwners();
  }, []);

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
    <>
      <h1 className="text-4xl font-bold mb-8">
        ➕ Add Restaurant
      </h1>

      <RestaurantForm
        owners={owners}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </>
  );
};

export default AdminAddRestaurant;
