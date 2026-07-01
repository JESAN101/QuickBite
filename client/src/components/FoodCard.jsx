const FoodCard = ({ food }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
      <img
  src={`http://localhost:5000/uploads/${food.image}`}
  alt={food.name}
/>

      <div className="p-4">
        <h3 className="text-xl font-bold">{food.name}</h3>

        <p className="text-gray-600 mt-2">
          {food.description}
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-orange-500 font-bold text-lg">
            Rs. {food.price}
          </span>

          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;