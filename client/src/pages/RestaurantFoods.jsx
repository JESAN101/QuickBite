import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUtensils } from "react-icons/fa";

import {
  getMyFoods,
  deleteMyFood,
  updateMyFood,
} from "../services/restaurantService";
import { getImageUrl } from "../utils/image";

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
      toast.error(error.response?.data?.message || "Failed to update food.");
    }
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name} from your menu?`);
    if (!confirmDelete) return;

    try {
      const data = await deleteMyFood(id);
      toast.success(data.message);
      fetchFoods();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete food.");
    }
  };

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase()),
  );

  const availableCount = foods.filter((f) => f.isAvailable).length;
  const unavailableCount = foods.length - availableCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 lg:text-4xl">
            Menu
          </h1>
          <p className="mt-1 text-gray-500">
            {foods.length} items · {availableCount} available ·{" "}
            {unavailableCount} unavailable
          </p>
        </div>

        <button
          onClick={() => navigate("/restaurant/foods/add")}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/25 transition hover:bg-orange-600"
        >
          <FaPlus />
          Add Food
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search your menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
            <p className="text-gray-500">Loading Menu...</p>
          </div>
        </div>
      ) : filteredFoods.length === 0 ? (
        <div className="rounded-2xl bg-white p-16 text-center shadow-sm ring-1 ring-gray-100">
          <FaUtensils className="mx-auto text-5xl text-gray-300" />
          <p className="mt-4 font-medium text-gray-500">
            {search
              ? "No foods match your search."
              : "Your menu is empty. Add your first dish!"}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="px-6 py-4 font-semibold text-gray-500">
                    Image
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-500">
                    Category
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-500">
                    Prep (min)
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {filteredFoods.map((food) => (
                  <tr
                    key={food._id}
                    className="transition hover:bg-orange-50/30"
                  >
                    <td className="px-6 py-4">
                      {food.image ? (
                        <img
                          src={getImageUrl(food.image)}
                          alt={food.name}
                          className="h-14 w-14 rounded-xl object-cover ring-1 ring-gray-100"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400">
                          No img
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 font-bold text-gray-900">
                      {food.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {food.categories?.map((c) => c.name).join(", ") || "—"}
                    </td>

                    <td className="px-6 py-4 text-center font-bold text-orange-600">
                      Rs. {food.price}
                    </td>

                    <td className="px-6 py-4 text-center text-gray-600">
                      {food.preparationTime} min
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleAvailability(food)}
                        className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                          food.isAvailable
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                      >
                        {food.isAvailable ? "Available" : "Unavailable"}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/restaurant/foods/edit/${food._id}`)
                          }
                          className="rounded-lg bg-blue-500 p-2.5 text-white transition hover:bg-blue-600"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => handleDelete(food._id, food.name)}
                          className="rounded-lg bg-red-500 p-2.5 text-white transition hover:bg-red-600"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantFoods;
