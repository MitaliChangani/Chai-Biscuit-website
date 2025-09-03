import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [partner, setPartner] = useState(null); // { name, phone_number }

  return (
    <AuthContext.Provider value={{ partner, setPartner }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
