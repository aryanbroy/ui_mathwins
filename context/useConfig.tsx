import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getConfig } from "@/lib/api/config";

/*Types*/

export type AppConfig = {
  id: string;
  version: string;
  daily_tournament: any;
  instant_tournament: any;
  single_player: any;
  leveling: any;
  base_points_by_level: any;
  scoring: any;
  points_distribution: any;
  caps: any;
  ad_units: any;
  lifelines: any;
  top_attempts: any;
  feature_flags: any;
  safety: any;
  referrals: any;
  rewards: any;
  cron: any;
  analytics: any;
  leaderboard: any;
  qa: any;
  isActive: boolean;
  createdAt: string;
  isDailyActive: boolean
};

const CONFIG_KEY = "GAME_CONFIG";

const DEFAULT_CONFIG: AppConfig = {
  id: "local",
  version: "0",
  daily_tournament: {},
  instant_tournament: {},
  single_player: {},
  leveling: {},
  base_points_by_level: {},
  scoring: {},
  points_distribution: {},
  caps: {},
  ad_units: {},
  lifelines: {},
  top_attempts: {},
  feature_flags: {},
  safety: {},
  referrals: {},
  rewards: {},
  cron: {},
  analytics: {},
  leaderboard: {},
  qa: {},
  isActive: true,
  isDailyActive: false,
  createdAt: "",
};

const ConfigContext = createContext<{
  config: AppConfig;
  error: string | null;
  refresh: () => Promise<void>;
}>({
  config: DEFAULT_CONFIG,
  error: null,
  refresh: async () => {},
});

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setError(null);

    try {
      
      const res = await getConfig();
      const data: AppConfig = res.config;
      data.isDailyActive = res.isDailyActive;
      console.log("CHECK SERVER ----------------- WOW - ",data);
      console.log("CHECK SERVER ----------------- WOW - ",data?.isDailyActive);

      setConfig(data);
      
      await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(data));
      return;
    } catch (serverErr) {
      console.warn("Server config fetch failed, trying cache...", serverErr);
    }

    // try {
    //   console.log("CHECK LOCAL -----------------");
    //   const cached = await AsyncStorage.getItem(CONFIG_KEY);
    //   if (cached) {
    //     setConfig(JSON.parse(cached));
    //     return;
    //   }
    // } catch (cacheErr) {
    //   console.warn("Cache read failed", cacheErr);
    // }

    setError("Failed to load config. Please check your connection and restart the app.");
  };

  // Show nothing (or a loader) until config resolves
  if (config === null && error === null) return null;

  return (
    <ConfigContext.Provider
      value={{
        config: config ?? DEFAULT_CONFIG,
        error,
        refresh: init,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

/*Hooks*/

export function useConfig() {
  return useContext(ConfigContext).config;
}

export function useConfigError() {
  return useContext(ConfigContext).error;
}

export function useRefreshConfig() {
  return useContext(ConfigContext).refresh;
}