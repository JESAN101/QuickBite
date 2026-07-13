import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  getAllFoods,
  deleteFood,
} from "../services/foodService";

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const data = await getAllFoods();
      setFoods(data.foods);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Delete ${name}?`
    );

    if (!confirmDelete) return;

    try {
      const data = await deleteFood(id);

      toast.success(data.message);

      fetchFoods();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Delete failed."
      );

    }
  };

  const filteredFoods = foods.filter((food) =>
    food.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          🍔 Food Management
        </h1>

       <button
  onClick={() => navigate("/admin/foods/add")}
  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg"
>
  + Add Food
</button>

      </div>

      <input
        type="text"
        placeholder="Search foods..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="border rounded-lg px-4 py-3 w-full md:w-96 mb-6"
      />

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4">Image</th>
              <th className="p-4">Food</th>
              <th className="p-4">Restaurant</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredFoods.map((food) => (

              <tr
                key={food._id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4">

                  <img
                    src={`http://localhost:5000/uploads/${food.image}`}
                    alt={food.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />

                </td>

                <td className="p-4 font-semibold">
                  {food.name}
                </td>

                <td className="p-4">
                  {food.restaurant?.name}
                </td>

                <td className="p-4">
                  {food.category?.name}
                </td>

                <td className="p-4">
                  Rs. {food.price}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      food.isAvailable
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {food.isAvailable
                      ? "Available"
                      : "Unavailable"}
                  </span>

                </td>

                <td className="p-4 space-x-2">

                  <button
  onClick={() =>
    navigate(`/admin/foods/edit/${food._id}`)
  }
  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
>
  Edit
</button>

                  <button
                    onClick={() =>
                      handleDelete(
                        food._id,
                        food.name
                      )
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AdminFoods;