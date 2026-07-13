import { FaEdit, FaTrash } from "react-icons/fa";

const CategoryTable = ({
  categories,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">

      <table className="w-full">

        <thead className="bg-orange-500 text-white">

          <tr>

            <th className="p-4 text-left">
              Category
            </th>

            <th className="p-4 text-left">
              Description
            </th>

            <th className="p-4 text-center">
              Created
            </th>

            <th className="p-4 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {categories.length === 0 ? (

            <tr>

              <td
                colSpan="4"
                className="text-center py-10 text-gray-500"
              >
                No Categories Found
              </td>

            </tr>

          ) : (

            categories.map((category) => (

              <tr
                key={category._id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4 font-semibold">
                  {category.name}
                </td>

                <td className="p-4 text-gray-600">
                  {category.description ||
                    "No description"}
                </td>

                <td className="p-4 text-center">
                  {new Date(
                    category.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-3">

                    <button
                      onClick={() =>
                        onEdit(category._id)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() =>
                        onDelete(category._id)
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
  );
};

export default CategoryTable;