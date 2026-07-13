import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";

import AdminLayout from "../layouts/AdminLayout";
import CategoryTable from "../components/admin/CategoryTable";

import {
  getAllCategories,
  deleteCategory,
} from "../services/categoryService";

const AdminCategories = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const data = await getAllCategories();

      setCategories(data.categories || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this category?"
    );

    if (!confirmDelete) return;

    try {
      const data = await deleteCategory(id);

      toast.success(data.message);

      fetchCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete category."
      );
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">

        <div>
          <h1 className="text-4xl font-bold">
            Category Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage food categories
          </p>
        </div>

        <div className="flex justify-between items-center">

          <input
            type="text"
            placeholder="Search Category..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-80 border rounded-lg px-4 py-3"
          />

          <button
            onClick={() =>
              navigate("/admin/categories/add")
            }
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg flex items-center gap-2"
          >
            <FaPlus />

            Add Category
          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white rounded-xl shadow-lg p-6">

            <h3 className="text-gray-500">
              Total Categories
            </h3>

            <h2 className="text-3xl font-bold mt-2">
              {categories.length}
            </h2>

          </div>

        </div>

        {loading ? (
          <div className="text-center py-20 text-xl">
            Loading Categories...
          </div>
        ) : (
          <CategoryTable
            categories={filteredCategories}
            onEdit={(id) =>
              navigate(`/admin/categories/edit/${id}`)
            }
            onDelete={handleDelete}
          />
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminCategories;