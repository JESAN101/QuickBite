import { createContext, useContext, useEffect, useState } from "react";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../services/favoriteService";
import { isLoggedIn } from "../utils/auth";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    if (!isLoggedIn()) {
      setFavorites([]);
      return;
    }

    try {
      const data = await getFavorites();
      setFavorites(data.favorites);
    } catch {
      // Request failed
      setFavorites([]);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const isFavorite = (foodId) => {
    return favorites.some(
      (item) => item.food._id === foodId
    );
  };

  const toggleFavorite = async (foodId) => {
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