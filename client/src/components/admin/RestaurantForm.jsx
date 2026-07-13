import { useEffect, useState } from "react";

const RestaurantForm = ({
  initialData = {},
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    image: null,
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (initialData._id) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        address: initialData.address || "",
        phone: initialData.phone || "",
        image: null,
      });

      if (initialData.image) {
        setPreview(
          `http://localhost:5000/uploads/${initialData.image}`
        );
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("address", formData.address);
    data.append("phone", formData.phone);

    if (formData.image) {
      data.append("image", formData.image);
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
          Restaurant Name
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

      <div>
        <label className="font-semibold">
          Address
        </label>

        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3 mt-2"
        />
      </div>

      <div>
        <label className="font-semibold">
          Phone
        </label>

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3 mt-2"
        />
      </div>

      <div>
        <label className="font-semibold">
          Restaurant Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="w-full border rounded-lg p-3 mt-2"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-4 w-48 h-32 rounded-lg object-cover border"
          />
        )}
      </div>

      <button
        disabled={loading}
        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg"
      >
        {loading
          ? "Saving..."
          : "Save Restaurant"}
      </button>
    </form>
  );
};

export default RestaurantForm;