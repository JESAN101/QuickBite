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

      {/* ---------- discovery toolbar: search + filters ---------- */}
      <section className="border-b border-[#EADFC8] bg-[#FFFBF3]">
        <div className="mx-auto max-w-7xl space-y-6 px-6 py-10">
          <SearchBar search={search} setSearch={setSearch} />

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
        </div>
      </section>

      {/* ---------- foods ---------- */}
      <section
        id="foods-section"
        className="scroll-mt-24 bg-[#FFFBF3] py-16"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D64933]/25 bg-[#D64933]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#D64933]">
                On the menu
              </span>
              <h2 className="mt-4 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-[#1D1512] md:text-4xl">
                Something{" "}
                <span className="font-['Fraunces',serif] italic font-normal text-[#D64933]">
                  delicious
                </span>{" "}
                for everyone
              </h2>
              <p className="mt-2 max-w-xl text-[#3A2A20]/60">
                Search, filter, and sort your way to the dish you're craving
                right now.
              </p>
            </div>

            <FilterBar
              sortBy={sortBy}
              setSortBy={setSortBy}
              clearFilters={clearFilters}
              foodCount={filteredFoods.length}
            />
          </div>

          <div className="mt-10">
            <Foods foods={filteredFoods} />
          </div>
        </div>
      </section>

      {/* ---------- restaurants ---------- */}
      <section
        id="restaurants-section"
        className="scroll-mt-24 bg-gradient-to-b from-[#1D1512] to-[#2A1F1A] py-16"
      >
        <div className="mx-auto max-w-7xl px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#F0A438]/30 bg-[#F0A438]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#F0A438]">
            Kitchens we love
          </span>
          <h2 className="mt-4 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-[#F7ECD9] md:text-4xl">
            Restaurants{" "}
            <span className="font-['Fraunces',serif] italic font-normal text-[#F0A438]">
              near you
            </span>
          </h2>
          <p className="mt-2 max-w-xl text-[#C9B8A3]">
            Local favorites and hidden gems, all ready to deliver.
          </p>

          <div className="mt-10">
            <Restaurants />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;