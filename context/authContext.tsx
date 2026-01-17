import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser, loginUser } from "@/lib/api/user";

type UserData = {
    name?: string;
    email?: string;
    picture?: string;
};
type ClientUserData = {
    username?: string;
    email?: string;
    picture?: string;
};
type AuthContextType = {
  user: ClientUserData | null;
  userToken: string;
  login: (user: UserData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: UserData) => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ClientUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ userToken, setUserToken ] = useState("");
  useEffect(() => {
    const restoreUser = async () => {
      try {
        // console.log("authCOntext called");
        
        const token = await AsyncStorage.getItem("token");
        // console.log("token : ",token);
        if (token) {
          setUserToken(JSON.parse(token));
          // console.log("token : ",token);
          
          const payload = {
            token: JSON.parse(token),
          }
          await getUser(payload).then((response)=>{
            console.log("response :- ",response);
            setUser(response.data);
            console.log("after setUser ", user);
            
          });
        }
      } catch (e) {
        console.log("Error loading token from AsyncStorage:", e);
      } finally {
        setLoading(false);
      }
    };
    restoreUser();
  }, [userToken]);

  const login = async (user: UserData) => {
    // console.log("authContext : user = ",user);
    
    try {
      if (!user.name || !user.email) {
        throw new Error("User name or email missing");
      }
      const payload = {
        username: user.name,
        email: user.email,
        picture: user.picture,
      }
      await loginUser(payload).then((response)=>{
        console.log("response :- ",response);
        // const newUser = {...user, userId: .id}
        AsyncStorage.setItem("token", JSON.stringify(response.data));
        setUserToken(response.data);
      });
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

  const updateProfile = async (profile: UserData) => {
    try {
      await AsyncStorage.setItem("@profile", JSON.stringify(profile));
      setUser(profile);
    } catch (e) {
      console.log("[Auth] profile update error", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userToken, login, logout, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
