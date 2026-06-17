import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => {},
});

export function UserProvider({ children }) {
  const [currentUser, setCurrentUserState] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("auctionUser");
    if (storedUser) {
      try {
        setCurrentUserState(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("auctionUser");
      }
    }
  }, []);

  const setCurrentUser = (user) => {
    if (user) {
      localStorage.setItem("auctionUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("auctionUser");
    }
    setCurrentUserState(user);
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}
