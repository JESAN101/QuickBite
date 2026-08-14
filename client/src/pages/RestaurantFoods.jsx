import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import {
  getMyFoods,
  deleteMyFood,
  updateMyFood,
} from "../services/restaurantService";

const RestaurantFoods = () => {
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchFoods = async () => {
    try {
      setLoading(true);

      const data = await getMyFoods();

      setFoods(data.foods || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load menu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleToggleAvailability = async (food) => {
    try {
      const formData = new FormData();

      formData.append("isAvailable", String(!food.isAvailable));

      const data = await updateMyFood(food._id, formData);

      toast.success(data.message);

      fetchFoods();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update food."
      );
    }
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Delete ${name} from your menu?`
    );

    if (!confirmDelete) return;

    try {
      const data = await deleteMyFood(id);

      toast.success(data.message);

      fetchFoods();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete food."
      );
    }
  };

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          My Menu
        </h1>

        <p className="text-gray-500 mt-2">
          Manage the food items of your restaurant
        </p>
      </div>

      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 border rounded-lg px-4 py-3"
        />

        <button
          onClick={() => navigate("/restaurant/foods/add")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg flex items-center gap-2"
        >
          <FaPlus />
          Add Food
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xl">
          Loading Menu...
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-center">Price</th>
                <th className="p-4 text-center">Prep (min)</th>
                <th className="p-4 text-center">Availability</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredFoods.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10 text-gray-500"
                  >
                    No Foods Found
                  </td>
                </tr>
              ) : (
                filteredFoods.map((food) => (
                  <tr
                    key={food._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4">
                      {food.image ? (
                        <img
                          src={`http://localhost:5000/uploads/${food.image}`}
                          alt={food.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </td>

                    <td className="p-4 font-semibold">
                      {food.name}
                    </td>

                    <td className="p-4">
                      {food.category?.name || "—"}
                    </td>

                    <td className="p-4 text-center font-semibold text-orange-600">
                      Rs. {food.price}
                    </td>

                    <td className="p-4 text-center">
                      {food.preparationTime}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() =>
                          handleToggleAvailability(food)
                        }
                        className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                          food.isAvailable
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                      >
                        {food.isAvailable
                          ? "Available"
                          : "Unavailable"}
                      </button>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() =>
                            navigate(
                              `/restaurant/foods/edit/${food._id}`
                            )
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(food._id, food.name)
                          }
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RestaurantFoods;
