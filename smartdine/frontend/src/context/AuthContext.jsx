import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Load from local storage on startup
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      if (typeof parsedUser.isAdmin === 'string') {
        parsedUser.isAdmin = parsedUser.isAdmin === 'true';
      }
      setUser(parsedUser);
      setToken(storedToken);
    }
    setAuthLoading(false);
  }, []);

  const login = (userData, userToken) => {
    if (typeof userData.isAdmin === 'string') {
      userData.isAdmin = userData.isAdmin === 'true';
    }
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
