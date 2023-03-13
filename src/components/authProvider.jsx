import useUser from "./useUser";
import { createContext } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { user, setUser, deleteUser } = useUser();
  return (
    <AuthContext.Provider value={{ user, setUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;