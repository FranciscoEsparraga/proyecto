import { useState } from "react";

import AuthContext from "../contexts/AuthContext.js";
import { localStorageKey } from "../config.js";

function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem(localStorageKey)) || {}
  );

  const setUserHandler = (newUser = {}) => {
    if (Object.keys(newUser).length === 0) return;

    const logUser = {
      ...user,
      ...newUser,
    };

    localStorage.setItem(localStorageKey, JSON.stringify(logUser));
    return setUser(logUser);
  };

  const logoutHandler = () => {
    localStorage.removeItem(localStorageKey);
    return setUser(null);
  };

  const authValues = {
    user,
    token: user?.token,
    isAuthenticated: Boolean(user?.token),
    setUser: setUserHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
