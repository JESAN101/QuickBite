import { useState, useEffect } from "react";

const FoodForm = ({
  initialData = {},
  categories,
  restaurants,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    restaurant: "",
    preparationTime: 20,
    isAvailable: true,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (initialData._id) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        category: initialData.category?._id || "",
        restaurant: initialData.restaurant?._id || "",
        preparationTime:
          initialData.preparationTime || 20,
        isAvailable:
          initialData.isAvailable ?? true,
      });

      if (initialData.image) {
        setPreview(
          `http://localhost:5000/uploads/${initialData.image}`
        );
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, checked, type } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (image) {
      data.append("image", image);
    }

    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-8 space-y-6"
    >
      <div>
        <label className="font-semibold">
          Food Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3 mt-2"
        />
      </div>

      <div>
        <label className="font-semibold">
          Description
        </label>

        <textarea
          rows="4"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3 mt-2"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="font-semibold">
            Price
          </label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 mt-2"
          />
        </div>

        <div>
          <label className="font-semibold">
            Preparation Time
          </label>

          <input
            type="number"
            name="preparationTime"
            value={formData.preparationTime}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-2"
          />
        </div>
      </div>

      {/* Image Upload */}

      <div>
        <label className="font-semibold block mb-3">
          Food Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border rounded-lg p-3"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-4 w-44 h-44 object-cover rounded-xl border shadow"
          />
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="font-semibold">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 mt-2"
          >
            <option value="">
              Select Category
            </option>

            {categories.map((cat) => (
              <option
                key={cat._id}
                value={cat._id}
              >
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold">
            Restaurant
          </label>

          <select
            name="restaurant"
            value={formData.restaurant}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 mt-2"
          >
            <option value="">
              Select Restaurant
            </option>

            {restaurants.map((restaurant) => (
              <option
                key={restaurant._id}
                value={restaurant._id}
              >
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="isAvailable"
          checked={formData.isAvailable}
          onChange={handleChange}
        />

        Available
      </label>

      <button
        disabled={loading}
        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg"
      >
        {loading
          ? "Saving..."
          : "Save Food"}
      </button>
    </form>
  );
};

export default FoodForm;