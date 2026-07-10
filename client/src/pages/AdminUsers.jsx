import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getAllUsers,
  deleteUser,
  updateUserRole,
} from "../services/adminService";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const currentUser = JSON.parse(
  localStorage.getItem("user")
);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data.users);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load users.");
    }
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Delete ${name}?`
    );

    if (!confirmed) return;

    try {
      const data = await deleteUser(id);

      toast.success(data.message);

      fetchUsers();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Delete failed."
      );

    }
  };

  const handleRoleChange = async (id, role) => {
  try {

    const data = await updateUserRole(id, role);

    toast.success(data.message);

    fetchUsers();

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Failed to update role."
    );

  }
};

  const filteredUsers = users.filter((user) =>
    user.name
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    user.email
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        👥 User Management
      </h1>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full md:w-96 border rounded-lg px-4 py-3 mb-6"
      />

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">
                Name
              </th>

              <th className="text-left p-4">
                Email
              </th>

              <th className="text-left p-4">
                Phone
              </th>

              <th className="text-left p-4">
                Role
              </th>

              <th className="text-left p-4">
                Joined
              </th>

              <th className="text-center p-4">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredUsers.map((user) => (

              <tr
                key={user._id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4 font-medium">
                  {user.name}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4">
                  {user.phone || "-"}
                </td>

                <td className="p-4">

  {user._id === currentUser._id ? (

    <span className="font-semibold text-gray-600">
      {user.role}
    </span>

  ) : (

    <select
      value={user.role}
      onChange={(e) =>
        handleRoleChange(
          user._id,
          e.target.value
        )
      }
      className="border rounded-lg px-3 py-2"
    >
      <option value="customer">
        Customer
      </option>

      <option value="admin">
        Admin
      </option>

    </select>

  )}

</td>

                <td className="p-4">
                  {new Date(
                    user.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="p-4 text-center">

                 <button
  disabled={user._id === currentUser._id}
  onClick={() =>
    handleDelete(
      user._id,
      user.name
    )
  }
  className={`px-4 py-2 rounded-lg text-white ${
    user._id === currentUser._id
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-red-500 hover:bg-red-600"
  }`}
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

export default AdminUsers;