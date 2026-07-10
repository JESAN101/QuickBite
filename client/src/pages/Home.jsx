import { useEffect, useState } from "react";

import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import Categories from "../components/Categories";
import RestaurantFilter from "../components/RestaurantFilter";
import Foods from "../components/Foods";
import Restaurants from "../components/Restaurants";

import { getAllFoods } from "../services/foodService";
import { getAllCategories } from "../services/categoryService";
import { getRestaurants } from "../services/restaurantService";
import FilterBar from "../components/FilterBar";

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRestaurant, setSelectedRestaurant] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchFoods();
    fetchCategories();
    fetchRestaurants();
  }, []);

  const fetchFoods = async () => {
    try {
      const data = await getAllFoods();
      setFoods(data.foods);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const data = await getRestaurants();
      setRestaurants(data.restaurants);
    } catch (error) {
      console.log(error);
    }
  };

const filteredFoods = foods
  .filter((food) => {
    const matchesSearch =
      food.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      food.description
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      food.category?._id === selectedCategory;

    const matchesRestaurant =
      selectedRestaurant === "all" ||
      food.restaurant?._id === selectedRestaurant;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesRestaurant
    );
  })
  .sort((a, b) => {
    switch (sortBy) {
      case "priceLow":
        return a.price - b.price;

      case "priceHigh":
        return b.price - a.price;

      case "name":
        return a.name.localeCompare(b.name);

      case "newest":
      default:
        return (
          new Date(b.createdAt) -
          new Date(a.createdAt)
        );
    }
  });
  const clearFilters = () => {
  setSearch("");
  setSelectedCategory("all");
  setSelectedRestaurant("all");
  setSortBy("newest");
};

  return (
    <>
      <Hero />

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <Categories
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <RestaurantFilter
        restaurants={restaurants}
        selectedRestaurant={selectedRestaurant}
        setSelectedRestaurant={setSelectedRestaurant}
      />  

<FilterBar
  sortBy={sortBy}
  setSortBy={setSortBy}
  clearFilters={clearFilters}
  foodCount={filteredFoods.length}
/>

      <Foods foods={filteredFoods} />

      <Restaurants />
    </>
  );
};

export default Home;