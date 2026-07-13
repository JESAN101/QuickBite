import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  createCategory,
  updateCategory,
  getCategoryById,
} from "../../services/categoryService";

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchCategory();
    }
  }, []);

  const fetchCategory = async () => {
    try {
      const data = await getCategoryById(id);

      setFormData({
        name: data.category.name,
        description:
          data.category.description || "",
      });
    } catch (error) {
      toast.error("Failed to load category.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEditing) {
        const data =
          await updateCategory(
            id,
            formData
          );

        toast.success(data.message);
      } else {
        const data =
          await createCategory(
            formData
          );

        toast.success(data.message);
      }

      navigate("/admin/categories");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      <h2 className="text-2xl font-bold mb-6">

        {isEditing
          ? "Edit Category"
          : "Add Category"}

      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <div>

          <label className="block mb-2 font-medium">
            Category Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-3"
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Description
          </label>

          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
        >
          {loading
            ? "Saving..."
            : isEditing
            ? "Update Category"
            : "Create Category"}
        </button>

      </form>

    </div>
  );
};

export default CategoryForm;