import { useState, useEffect } from "react";
import { getImageUrl } from "../../utils/image";

const FoodForm = ({
  initialData = {},
  categories,
  restaurants,
  fixedRestaurantId,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categories: [],
    restaurant: fixedRestaurantId || "",
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
        categories: initialData.categories?.map((c) => c._id || c) || [],
        restaurant:
          fixedRestaurantId ||
          initialData.restaurant?._id ||
          "",
        preparationTime:
          initialData.preparationTime || 20,
        isAvailable:
          initialData.isAvailable ?? true,
      });

      if (initialData.image) {
        setPreview(getImageUrl(initialData.image));
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

  const toggleCategory = (catId) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(catId);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== catId)
          : [...prev.categories, catId],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "categories") {
        data.append("categories", formData.categories.join(","));
      } else {
        data.append(key, formData[key]);
      }
    });

    if (image) {
      data.append("image", image);
    }

    onSubmit(data);
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100";

  const labelClass =
    "mb-1 block text-sm font-semibold text-gray-700";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              Food Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Price (Rs.)
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Description
          </label>

          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              Preparation Time (min)
            </label>

            <input
              type="number"
              name="preparationTime"
              value={formData.preparationTime}
              onChange={handleChange}
              min="1"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Restaurant
            </label>

            <select
              name="restaurant"
              value={formData.restaurant}
              onChange={handleChange}
              required
              disabled={Boolean(fixedRestaurantId)}
              className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
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

        <div>
          <label className={labelClass}>
            Categories
            <span className="ml-1 font-normal text-gray-400">
              (select one or more)
            </span>
          </label>

          <div className="min-h-[52px] rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
            {categories.length === 0 ? (
              <p className="py-1 text-sm text-gray-400">
                No categories available
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const active = formData.categories.includes(cat._id);
                  return (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => toggleCategory(cat._id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                        active
                          ? "border-orange-300 bg-orange-50 text-orange-700 shadow-sm"
                          : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                          active
                            ? "border-orange-400 bg-orange-500"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {active && (
                          <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {formData.categories.length > 0 && (
            <p className="mt-1.5 text-xs text-gray-400">
              {formData.categories.length} categor{formData.categories.length === 1 ? "y" : "ies"} selected
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Food Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 h-44 w-44 rounded-xl object-cover ring-1 ring-gray-200"
            />
          )}
        </div>

        <label className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-gray-100">
          <input
            type="checkbox"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
            className="h-4 w-4 accent-orange-500"
          />

          <span className="text-sm font-semibold text-gray-700">
            Available for ordering
          </span>
        </label>

        <button
          disabled={loading}
          className="rounded-xl bg-orange-500 px-8 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/25 transition hover:bg-orange-600 disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : "Save Food"}
        </button>
      </div>
    </form>
  );
};

export default FoodForm;
