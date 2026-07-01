import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import Categories from "../components/Categories";
import Foods from "../components/Foods";
import Restaurants from "../components/Restaurants";

const Home = () => {
  return (
    <>
      <Hero />
      <SearchBar />
      <Categories />
      <Foods />
      <Restaurants />
    </>
  );
};

export default Home;