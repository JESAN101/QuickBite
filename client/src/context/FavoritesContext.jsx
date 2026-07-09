import { createContext, useContext, useEffect, useState } from "react";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../services/favoriteService";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data.favorites);
    } catch (error) {
      // User not logged in or request failed
      setFavorites([]);
    }
  };

  const isFavorite = (foodId) => {
    return favorites.some(
      (item) => item.food._id === foodId
    );
  };

  const toggleFavorite = async (foodId) => {
    try {
      const existing = favorites.find(
        (item) => item.food._id === foodId
      );

      if (existing) {
        await removeFavorite(existing._id);

        setFavorites((prev) =>
          prev.filter((item) => item._id !== existing._id)
        );
      } else {
        await addFavorite(foodId);

        // Reload favorites to get the newly created favorite document
        loadFavorites();
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        loadFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  return useContext(FavoritesContext);
};