import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser, loginUser } from '@/lib/api/user';

type UserData = {
    name?: string;
    email?: string;
    picture?: string;
    referralCode: String;
    soundEffect: boolean;
    haptics: boolean;
    toggleSound: ()=>void;
    toggleHaptics: ()=>void;
};
type ClientUserData = {
    username?: string;
    email?: string;
    picture?: string;
    referralCode: String;
    userId: string;
    coins: number;
    isAdmin: boolean;
  };
type AuthContextType = {
  user: ClientUserData | null;
  userToken: string;
  login: (user: UserData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: UserData) => Promise<void>;
  loading: boolean;
  soundEffect: boolean;
  haptics: boolean;
  toggleSound: ()=>void;
  toggleHaptics: ()=>void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ClientUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [ userToken, setUserToken ] = useState("");
  useEffect(() => {
    const restoreUser = async () => {
      try {
        // console.log("authCOntext called");

        const token = await AsyncStorage.getItem('token');
        // console.log("token : ",token);
        if (token) {
          setUserToken(JSON.parse(token));
          // console.log("token : ",token);

          const payload = {
            token: JSON.parse(token),
          };
          await getUser(payload).then((response) => {
            console.log('response :- ', response);
            setUser(response.data);
            console.log('after setUser ', user);
          });
        }
      } catch (e) {
        console.log('Error loading token from AsyncStorage:', e);
      } finally {
        setLoading(false);
      }
    };
    restoreUser();
  }, [userToken]);

  const login = async (user: UserData) => {
    console.log("authContext : user = ",user);
    
    try {
      if (!user.name || !user.email) {
        throw new Error('User name or email missing');
      }
      const payload = {
        username: user.name,
        email: user.email,
        picture: user.picture,
        referralCode: user.referralCode
      }
      loginUser(payload).then(async (response)=>{
        console.log("response loginUser :- ",response);
        // const newUser = {...user, userId: .id}
        await AsyncStorage.setItem("token", JSON.stringify(response.data)).then(()=>{console.log("done !!")}).catch(()=>{console.log("err");});
        setUserToken(response.data);
      }).catch((err)=>{console.log("error :- ",err);
      });
    } catch (e) {
      console.log("c", e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUser(null);
    } catch (e) {
      console.log('Error removing token from AsyncStorage:', e);
    }
  };

  const updateProfile = async (profile: UserData) => {
    // try {
    //   await AsyncStorage.setItem('@profile', JSON.stringify(profile));
    //   setUser(profile);
    // } catch (e) {
    //   console.log('[Auth] profile update error', e);
    // }
  };

  const toggleSound = ()=>{
    setSound(!sound);
  }
  const toggleHaptics = ()=>{
    setHaptics(!haptics);
  }

  return (
    <AuthContext.Provider value={{ user, userToken, login, logout, loading, updateProfile, soundEffect: sound, toggleSound,  haptics, toggleHaptics }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
