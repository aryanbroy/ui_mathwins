import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ColorScheme {
  // base surfaces
  bg: string;              // screen background
  bgPrimary: string;
  surface: string;         // generic surface (modals, blocks)
  card: string;            // cards like Profile settings rows

  // text
  text: string;
  textSecondary: string;
  textHighlight: string;
  textMuted: string;
  textOnPrimary: string;   // e.g. "Send OTP" on purple button

  // borders & decor
  border: string;
  divider: string;
  shadow: string;

  // brand / semantic
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;

  gradients: {
    background: [string, string]; // big screen background (login/profile top)
    surface: [string, string];    // pink panel behind cards
    primary: [string, string];    // primary CTA (Send OTP)
    success: [string, string];
    warning: [string, string];
    danger: [string, string];
    muted: [string, string];
    empty: [string, string];
  };

  backgrounds: {
    input: string;     // normal input
    editInput: string; // focused / editing input
  };

  cardTexture: {
    bg1: string;
    bg2: string;
    bg3: string;
  }

  tabBar: {
    background: string;
    borderTop: string;
    iconActive: string;
    iconInactive: string;
  };

  controls: {
    switchTrackOn: string;
    switchThumbOn: string;
    switchTrackOff: string;
    switchThumbOff: string;
    checkboxBorder: string;
    checkboxFill: string;
  };

  statusBarStyle: "light-content" | "dark-content";
}

const lightColors: ColorScheme = {
  bg: "#F5F4FF",              // very light lavender backing
  bgPrimary: "#6A4DFB",
  surface: "#FFFFFF",         // plain white surface
  card: "#FFFFFF",            // profile cards

  text: "#111827",
  textSecondary: "#FFFFFF",
  textHighlight: "#660012",
  textMuted: "#6B7280",
  textOnPrimary: "#000",
  
  border: "#838383",
  divider: "#E5E7EB",
  shadow: "rgba(15,23,42,0.12)",
  
  primary: "#6315FF",
  secondary: "#FF627D",
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#EF4444",
  
  gradients: {
    // big purple → pink gradient (login & profile header)
    background: ["#6315FF", "#FFCCD7"],
    // panel behind the cards on profile screen
    surface: ["#FFCCD5", "#9087E5"],
    // CTA buttons like "Send OTP"
    primary: ["#6A4DFB", "#4C2FE0"],
    success: ["#4ADE80", "#16A34A"],
    warning: ["#FBBF24", "#D97706"],
    danger: ["#F87171", "#DC2626"],
    muted: ["#FFB9DC", "#FFD6DD"],
    empty: ["#F9FAFB", "#E5E7EB"],
  },
  
  backgrounds: {
    input: "#FFFFFF",
    editInput: "#FFFFFF",
  },
  
  cardTexture: {
    bg1: "#ffb3b3",
    bg2: "#FFD6DD",
    bg3: "#FFFFFF",
  },

  tabBar: {
    background: "#FFFFFF",
    borderTop: "rgba(148,163,184,0.25)",
    iconActive: "#6A4DFB",
    iconInactive: "#9CA3AF",
  },
  
  controls: {
    switchTrackOn: "#6A4DFB",
    switchThumbOn: "#FFFFFF",
    switchTrackOff: "#E5E7EB",
    switchThumbOff: "#FFFFFF",
    checkboxBorder: "#111827",
    checkboxFill: "#6A4DFB",
  },
  
  statusBarStyle: "light-content",
};

const darkColors: ColorScheme = {
  bg: "#020617",         // near-black blue
  bgPrimary: "#000",
  surface: "#020617",
  card: "#1F2933",       // cards in profile/settings
  
  text: "#F9FAFB",
  textSecondary: "#FFFFFF",
  textHighlight: "#FF627D",
  textMuted: "#9CA3AF",
  textOnPrimary: "#FFD6DF",

  border: "#1F2933",
  divider: "#111827",
  shadow: "rgba(0,0,0,0.6)",

  primary: "#6315FF",
  secondary: "#FF627D",
  success: "#22C55E",
  warning: "#FBBF24",
  danger: "#F97373",

  gradients: {
    // dark header / login background (can still be slightly purple)
    background: ["#6315FF", "#FFCCD7"],
    surface: ["#000000", "#353535"],
    primary: ["#6A4DFB", "#4C2FE0"],
    success: ["#22C55E", "#15803D"],
    warning: ["#FBBF24", "#D97706"],
    danger: ["#F97373", "#DC2626"],
    muted: ["#000000", "#242424"],
    empty: ["#111827", "#020617"],
  },

  backgrounds: {
    input: "#020617",
    editInput: "#020617",
  },

  cardTexture: {
    bg1: "#8a8a8a",
    bg2: "#5c5c5c",
    bg3: "#393939",
  },

  tabBar: {
    background: "#020617",
    borderTop: "rgba(15,23,42,0.9)",
    iconActive: "#F97316", // you’re using orange-ish/pink active icon
    iconInactive: "#4B5563",
  },

  controls: {
    switchTrackOn: "#2563EB",
    switchThumbOn: "#FFFFFF",
    switchTrackOff: "#4B5563",
    switchThumbOff: "#9CA3AF",
    checkboxBorder: "#E5E7EB",
    checkboxFill: "#6A4DFB",
  },

  statusBarStyle: "light-content",
};


interface ThemeContextType { 
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: ColorScheme;
}

const ThemeContext = createContext<undefined | ThemeContextType>(undefined);
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("darkMode").then((value) => {
      if(value){
        setIsDarkMode(JSON.parse(value));
      }
    });
  }, []);

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    console.log("mode: ", newMode);
    
    await AsyncStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  const colors = isDarkMode ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if(context === undefined){
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

export default useAppTheme