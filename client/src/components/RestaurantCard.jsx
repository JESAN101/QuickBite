import { Link } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurant/${restaurant._id}`}
      className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
    >
      <img
        src={`http://localhost:5000/uploads/${restaurant.image}`}
        alt={restaurant.name}
        className="w-full h-56 object-cover"
      />

      <div className="p-5">
        <h3 className="text-xl font-bold">
          {restaurant.name}
        </h3>

        <p className="text-gray-600 mt-2">
          {restaurant.description}
        </p>

        <p className="mt-3 font-medium">
          📍 {restaurant.address}
        </p>

        <p className="mt-2">
          📞 {restaurant.phone}
        </p>

        <span
          className={`inline-block mt-4 px-3 py-1 rounded-full text-white ${
            restaurant.isOpen
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          {restaurant.isOpen ? "Open" : "Closed"}
        </span>
      </div>
    </Link>
  );
};

export default RestaurantCard;