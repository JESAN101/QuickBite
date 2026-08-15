import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  getAllFoods,
  deleteFood,
} from "../services/foodService";
import { getImageUrl } from "../utils/image";

const PAGE_SIZE = 10;

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const navigate = useNavigate();

  const fetchFoods = useCallback(async () => {
    try {
      const data = await getAllFoods({
        page,
        limit: PAGE_SIZE,
        search,
      });

      setFoods(data.foods);
      setPages(data.pages);
    } catch (error) {
      console.log(error);
    }
  }, [page, search]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

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

  const statusBadge = (food) => (
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
  );

  return (
    <div>

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          🍔 Food Management
        </h1>

      </div>

      <input
        type="text"
        placeholder="Search foods..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="border rounded-lg px-4 py-3 w-full md:w-96 mb-6"
      />

      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">

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

            {foods.map((food) => (

              <tr
                key={food._id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4">

                  <img
                    src={getImageUrl(food.image)}
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
                  {statusBadge(food)}
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

      <div className="md:hidden space-y-4">

        {foods.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            No foods found.
          </div>
        ) : (
          foods.map((food) => (
            <div
              key={food._id}
              className="bg-white rounded-xl shadow p-4"
            >
              <div className="flex gap-4">
                <img
                  src={getImageUrl(food.image)}
                  alt={food.name}
                  className="w-20 h-20 rounded-lg object-cover shrink-0"
                />

                <div className="flex-1">
                  <p className="font-semibold">
                    {food.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {food.restaurant?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {food.category?.name}
                  </p>
                  <p className="font-semibold">
                    Rs. {food.price}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex justify-between items-center gap-2">
                {statusBadge(food)}

                <div className="space-x-2">

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

                </div>
              </div>
            </div>
          ))
        )}

      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() =>
            setPage((p) => Math.max(1, p - 1))
          }
          disabled={page <= 1}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-gray-600">
          Page {page} of {pages}
        </span>

        <button
          onClick={() =>
            setPage((p) => Math.min(pages, p + 1))
          }
          disabled={page >= pages}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default AdminFoods;
