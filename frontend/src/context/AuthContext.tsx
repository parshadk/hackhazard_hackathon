import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import axios from "axios";
import { API_URL } from "../utils/api";

interface User {
  name: string;
  email: string;
  xp: number;
  level: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  btnLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<string>;
  verifyOTP: (otp: string, activationToken: string) => Promise<void>;
  fetchUser: () => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string, token: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    fetchUser(); // initial check on app load
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      axios.defaults.headers.common["token"] = token;
      const { data } = await axios.get<{ user: User }>(`${API_URL}/user/me`);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Fetch user failed:", error);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["token"];
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post<{ token: string; user: User }>(`${API_URL}/user/login`, { email, password });
      localStorage.setItem("token", data.token);
      axios.defaults.headers.common["token"] = data.token;
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setBtnLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post<{ activationToken: string }>(`${API_URL}/user/register`, {
        name,
        email,
        password,
      });
      return data.activationToken;
    } catch (error) {
      throw error;
    } finally {
      setBtnLoading(false);
    }
  };

  const verifyOTP = async (otp: string, activationToken: string) => {
    setBtnLoading(true);
    try {
      await axios.post(`${API_URL}/user/verify`, { otp, activationToken });
      localStorage.removeItem("activationToken");
    } catch (error) {
      throw error;
    } finally {
      setBtnLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["token"];
    setUser(null);
    setIsAuthenticated(false);
  };

  const forgotPassword = async (email: string) => {
    setBtnLoading(true);
    try {
      await axios.post(`${API_URL}/user/forgot`, { email });
    } catch (error) {
      throw error;
    } finally {
      setBtnLoading(false);
    }
  };

  const resetPassword = async (password: string, token: string) => {
    setBtnLoading(true);
    try {
      await axios.post(`${API_URL}/user/reset?token=${token}`, { password });
    } catch (error) {
      throw error;
    } finally {
      setBtnLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setBtnLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User is not authenticated");
      await axios.post(
        `${API_URL}/user/change-password`,
        { currentPassword, newPassword },
        { headers: { token } }
      );
    } catch (error) {
      throw error;
    } finally {
      setBtnLoading(false);
    }
  };

 

  const updateProfile = async (name: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("User is not authenticated")
      }

      const { data } = await axios.put<{ user: User }>(
        `${API_URL}/user/profile`,
        { name },
        {
          headers: {
            token,
          },
        }
      )

      setUser(data.user) // Update the user in context
    } catch (error) {
      throw error
    }
  }
  

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        btnLoading,
        login,
        register,
        verifyOTP,
        fetchUser,
        logout,
        forgotPassword,
        resetPassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
