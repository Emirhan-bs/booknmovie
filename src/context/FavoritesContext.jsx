import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bnm_favorites") || "[]");
    } catch { return []; }
  });

  const [myList, setMyList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bnm_mylist") || "[]");
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("bnm_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("bnm_mylist", JSON.stringify(myList));
  }, [myList]);

  const toggleFavorite = (item) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === item.id)
        ? prev.filter((f) => f.id !== item.id)
        : [...prev, item]
    );
  };

  const toggleList = (item) => {
    setMyList((prev) =>
      prev.some((f) => f.id === item.id)
        ? prev.filter((f) => f.id !== item.id)
        : [...prev, item]
    );
  };

  const isFavorite = (id) => favorites.some((f) => f.id === id);
  const isInList = (id) => myList.some((f) => f.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, myList, toggleFavorite, toggleList, isFavorite, isInList }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
