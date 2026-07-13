import { FaEdit, FaTrash } from "react-icons/fa";

const RestaurantTable = ({
  restaurants,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">

      <table className="w-full">

        <thead className="bg-orange-500 text-white">
          <tr>
            <th className="p-4 text-left">Image</th>
            <th className="p-4 text-left">Restaurant</th>
            <th className="p-4 text-left">Address</th>
            <th className="p-4 text-left">Phone</th>
            <th className="p-4 text-left">Owner</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>

          {restaurants.length === 0 ? (

            <tr>
              <td
                colSpan="6"
                className="text-center py-10 text-gray-500 text-lg"
              >
                No restaurants found.
              </td>
            </tr>

          ) : (

            restaurants.map((restaurant) => (

              <tr
                key={restaurant._id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="p-4">

                  <img
                    src={
                      restaurant.image
                        ? `http://localhost:5000/uploads/${restaurant.image}`
                        : "https://via.placeholder.com/80x60?text=No+Image"
                    }
                    alt={restaurant.name}
                    className="w-20 h-14 rounded object-cover border"
                  />

                </td>

                <td className="p-4 font-semibold">
                  {restaurant.name}
                </td>

                <td className="p-4">
                  {restaurant.address}
                </td>

                <td className="p-4">
                  {restaurant.phone}
                </td>

                <td className="p-4">
                  {restaurant.owner?.name || "-"}
                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-3">

                    <button
                      onClick={() => onEdit(restaurant._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => onDelete(restaurant._id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition"
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
  );
};

export default RestaurantTable;