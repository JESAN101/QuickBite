import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getRestaurant } from "../services/restaurantService";
import { getFoodsByRestaurant } from "../services/foodService";
import { Link } from "react-router-dom";

const Restaurant = () => {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetchRestaurant();
    fetchFoods();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const data = await getRestaurant(id);
      setRestaurant(data.restaurant);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFoods = async () => {
    try {
      const data = await getFoodsByRestaurant(id);
      setFoods(data.foods);
    } catch (error) {
      console.log(error);
    }
  };

  if (!restaurant) {
    return (
      <div className="text-center mt-20 text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Restaurant Info */}

      <img
        src={`http://localhost:5000/uploads/${restaurant.image}`}
        alt={restaurant.name}
        className="w-full h-96 object-cover rounded-xl"
      />

      <h1 className="text-4xl font-bold mt-8">
        {restaurant.name}
      </h1>

      <p className="text-gray-600 mt-4">
        {restaurant.description}
      </p>

      <p className="mt-4">
        📍 {restaurant.address}
      </p>

      <p className="mt-2">
        📞 {restaurant.phone}
      </p>

      <hr className="my-10" />

      {/* Restaurant Menu */}

      <h2 className="text-3xl font-bold mb-8">
        🍔 Menu
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {foods.map((food) => (

          <div
            key={food._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
          >

            <img
              src={`http://localhost:5000/uploads/${food.image}`}
              alt={food.name}
              className="w-full h-56 object-cover"
            />

            <div className="p-5">

              <h3 className="text-xl font-bold">
                {food.name}
              </h3>

              <p className="text-gray-600 mt-2">
                {food.description}
              </p>

              <p className="text-2xl font-bold text-red-500 mt-4">
                Rs. {food.price}
              </p>

              <Link
  to={`/food/${food._id}`}
  className="block mt-5 w-full bg-red-500 text-white text-center py-2 rounded-lg hover:bg-red-600 transition"
>
  View Food
</Link>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Restaurant;