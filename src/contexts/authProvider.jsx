import { createContext, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userCookie, setUserCookie] = useState(null);
  // const userCookie =document.cookie.split(';').find(cookie => cookie.trim().startsWith('user='));
  // const user = userCookie ? JSON.parse(userCookie.split('=')[1]) : null;
  useEffect(() => {
    const cookies = document.cookie.split(';').find(cookie => cookie.trim().startsWith('user='));
    if(cookies){
      
    
  return (
    <AuthContext.Provider>

      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;