import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getAllUsers,
  deleteUser,
  updateUserRole,
} from "../services/adminService";

const PAGE_SIZE = 10;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getAllUsers({
        page,
        limit: PAGE_SIZE,
        search,
      });

      setUsers(data.users);
      setPages(data.pages);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load users.");
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  const roleControl = (user) => {
    if (user._id === currentUser._id) {

      return (
        <span className="font-semibold text-gray-600">
          {user.role}
        </span>
      );

    }

    return (
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

        <option value="restaurant">
          Restaurant
        </option>

        <option value="rider">
          Rider
        </option>

        <option value="admin">
          Admin
        </option>

      </select>
    );
  };

  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        👥 User Management
      </h1>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full md:w-96 border rounded-lg px-4 py-3 mb-6"
      />

      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">

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

            {users.map((user) => (

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
                  {roleControl(user)}
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

      <div className="md:hidden space-y-4">

        {users.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            No users found.
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-xl shadow p-4"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="font-medium">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.email}
                  </p>
                </div>
                <span className="text-sm text-gray-500 shrink-0">
                  {user.phone || "-"}
                </span>
              </div>

              <div className="mt-3 flex justify-between items-center gap-2">
                <span className="text-sm text-gray-500">
                  {new Date(
                    user.createdAt
                  ).toLocaleDateString()}
                </span>
                {roleControl(user)}
              </div>

              <div className="mt-3 flex justify-end">
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

export default AdminUsers;
