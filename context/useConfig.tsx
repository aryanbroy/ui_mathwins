import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getConfig } from "@/lib/api/config";

/* ======================================================
   Types
====================================================== */

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
};

const CONFIG_KEY = "GAME_CONFIG";
const CONFIG_TIME_KEY = "GAME_CONFIG_TIME";

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
  createdAt: "",
};

const ConfigContext = createContext<{
  config: AppConfig;
  refresh: () => Promise<void>;
}>({
  config: DEFAULT_CONFIG,
  refresh: async () => {},
});

const TTL = 6 * 60 * 60 * 1000; // 6 hours

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    console.log("INIT called");
    
    init();
  }, []);

  const init = async () => {
    // 1. Load cached instantly
    const cached = await AsyncStorage.getItem(CONFIG_KEY);
    if (cached) {
      setConfig(JSON.parse(cached));
    }

    // 2. Check TTL
    // const lastTime = await AsyncStorage.getItem(CONFIG_TIME_KEY);
    // const isExpired =
    //   !lastTime || Date.now() - Number(lastTime) > TTL;

    // if (isExpired) {
    //   fetchLatest();
    // }
    fetchLatest();
  };

  const fetchLatest = async () => {
    try {
    //   const res = await getConfig();
      const res = await getConfig().then(async (res)=>{
        console.log("config :- ", res.config);
        setConfig(res.config);
        const data: AppConfig = res.config;
        await AsyncStorage.multiSet([
          [CONFIG_KEY, JSON.stringify(data)],
          [CONFIG_TIME_KEY, Date.now().toString()],
        ]);
      }).catch((error)=>{
        console.log(error);
      }); 

    } catch {
      console.log("Using cached config (offline)");
    }
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        refresh: fetchLatest,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

/* ======================================================
   Hook
====================================================== */

export function useConfig() {
  return useContext(ConfigContext).config;
}

/* Optional manual refresh hook */
export function useRefreshConfig() {
  return useContext(ConfigContext).refresh;
}
