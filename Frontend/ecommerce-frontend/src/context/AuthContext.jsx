import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');

  const login = (jwt, userRole, userName, userId) => {
    setToken(jwt);
    setRole(userRole);
    setUsername(userName);
    setUserId(userId);

    localStorage.setItem('token', jwt);
    localStorage.setItem('role', userRole);
    localStorage.setItem('username', userName);
    localStorage.setItem('userId', userId);
  };
    const logout = () => {
      setToken('');
      setRole('');
      setUsername('');
      localStorage.clear();
    };

  return (
    <AuthContext.Provider value={{ token, role, username, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
