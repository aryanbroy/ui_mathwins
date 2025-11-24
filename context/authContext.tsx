import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserData = {
    name?: string;
    email?: string;
    picture?: string;
};
type AuthContextType = {
  user: UserData | null ;
  login: (user: UserData) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        // console.log("token : ",token);
        if (token) {
          setUser(JSON.parse(token));
        }
      } catch (e) {
        console.log("Error loading token from AsyncStorage:", e);
      } finally {
        setLoading(false);
      }
    };
    restoreUser();
  }, []);

  const login = async (user: UserData) => {
    console.log("authContext : user = ",user);
    
    try {
      await AsyncStorage.setItem("token", JSON.stringify(user));
      setUser(user);
    } catch (e) {
      console.log("Error saving token to AsyncStorage:", e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setUser(null);
    } catch (e) {
      console.log("Error removing token from AsyncStorage:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
