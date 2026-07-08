import { Link } from "react-router-dom";

const FoodCard = ({ food }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">

      <Link to={`/food/${food._id}`}>
        <img
          src={`http://localhost:5000/uploads/${food.image}`}
          alt={food.name}
          className="w-full h-56 object-cover"
        />

        <div className="p-4">
          <h3 className="text-xl font-bold">
            {food.name}
          </h3>

          <p className="text-gray-600 mt-2">
            {food.description}
          </p>
        </div>
      </Link>

      <div className="flex justify-between items-center px-4 pb-4">
        <span className="text-orange-500 font-bold text-lg">
          Rs. {food.price}
        </span>

        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
          Add to Cart
        </button>
      </div>

    </div>
  );
};

export default FoodCard;