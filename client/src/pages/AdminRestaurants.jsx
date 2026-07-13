import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";
import RestaurantTable from "../components/admin/RestaurantTable";

import {
  getRestaurants,
  deleteRestaurant,
} from "../services/restaurantService";

const AdminRestaurants = () => {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const data = await getRestaurants();
      setRestaurants(data.restaurants);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load restaurants.");
    }
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this restaurant?"
  );

  if (!confirmDelete) return;

  try {
    const data = await deleteRestaurant(id);

    toast.success(data.message);

    fetchRestaurants();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Delete failed."
    );
  }
};

  const filteredRestaurants = restaurants.filter((restaurant) => {
  const keyword = search.toLowerCase();

  return (
    restaurant.name.toLowerCase().includes(keyword) ||
    restaurant.address.toLowerCase().includes(keyword) ||
    restaurant.phone.toLowerCase().includes(keyword)
  );
});

  return (
    <div className="flex bg-gray-100 min-h-screen">

      <div className="flex-1 p-8">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">
            🏪 Restaurant Management
          </h1>

          <Link
  to="/admin/restaurants/add"
  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
>
  + Add Restaurant
</Link>

        </div>

        <div className="mb-6">

          <input
            type="text"
            placeholder="Search restaurant..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full md:w-96 border rounded-lg p-3"
          />

        </div>

        <RestaurantTable
          restaurants={filteredRestaurants}
          onEdit={(id) =>
            navigate(`/admin/restaurants/edit/${id}`)
          }
          onDelete={handleDelete}
        />

      </div>

    </div>
  );
};

export default AdminRestaurants;