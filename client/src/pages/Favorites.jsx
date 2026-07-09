import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getFavorites,
  removeFavorite,
} from "../services/favoriteService";

import { addToCart } from "../services/cartService";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data.favorites);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFavorite(id);

      fetchFavorites();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = async (foodId) => {
    try {
      await addToCart(foodId, 1);

      alert("Added to cart.");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to add to cart."
      );
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold">
          No Favorites Yet ❤️
        </h1>

        <p className="text-gray-500 mt-4">
          Save your favorite foods here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold mb-10">
        My Favorites ❤️
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {favorites.map((item) => (

          <div
            key={item._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >

            <Link to={`/food/${item.food._id}`}>

              <img
                src={`http://localhost:5000/uploads/${item.food.image}`}
                alt={item.food.name}
                className="w-full h-56 object-cover"
              />

            </Link>

            <div className="p-5">

              <h2 className="text-xl font-bold">
                {item.food.name}
              </h2>

              <p className="text-gray-500 mt-2">
                {item.food.description}
              </p>

              <p className="text-orange-500 text-2xl font-bold mt-4">
                Rs. {item.food.price}
              </p>

              <div className="flex gap-3 mt-6">

                <button
                  onClick={() =>
                    handleAddToCart(item.food._id)
                  }
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg"
                >
                  Add To Cart
                </button>

                <button
                  onClick={() =>
                    handleRemove(item._id)
                  }
                  className="bg-red-500 hover:bg-red-600 text-white px-5 rounded-lg"
                >
                  Remove
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Favorites;