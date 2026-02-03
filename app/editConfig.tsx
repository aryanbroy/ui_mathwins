import { getConfig, saveConfig } from "@/lib/api/config";
import React, { JSX, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


type ConfigType = Record<string, any>;
const HIDDEN_TOP_LEVEL_KEYS = new Set([
  "id",
  "createdAt",
  "updatedAt",
  "updatedBy",
  "version",
  "schema_version",
  "notes",
]);

export default function AdminPanelScreen() {
  const [config, setConfig] = useState<ConfigType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");
  const [isDailyActive, setIsDailyActive] = useState(true);

  useEffect(() => {
    async function getCurrentConfig() {
      try {
        const res = await getConfig().then((res)=>{
          console.log("config :- ", res.config);
          setConfig(res.config);
        }); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    getCurrentConfig();
  }, []);

  const getFieldType = (value: any) => {
    if (typeof value === "boolean") return "boolean";
    if (typeof value === "number") return "number";
    if (typeof value === "string") return "string";
    if (Array.isArray(value)) return "array";
    if (typeof value === "object") return "object";
    return "unknown";
  };

  const updateNestedConfig = (path: string[], value: any) => {
    setConfig((prev) => {
      if (!prev) return prev;

      const newConfig = { ...prev };
      let current: any = newConfig;

      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }

      current[path[path.length - 1]] = value;
      return newConfig;
    });
  };
  
  const parseNumber = (text: string, previousValue: number) => {
    if (text === "" || text === "-" || text === ".") {
      return previousValue;
    }

    const num = Number(text);
    return Number.isNaN(num) ? previousValue : num;
  };
  const isDecimal = (value: number) => {
    return !Number.isInteger(value);
  };
  const [numberDrafts, setNumberDrafts] = useState<Record<string, string>>({});

  const renderConfig = (
    obj: Record<string, any>,
    basePath: string[]
  ): (JSX.Element | null)[] => {
    return Object.entries(obj)
      .filter(([key]) => !HIDDEN_TOP_LEVEL_KEYS.has(key))
      .map(([key, value]) => {
        const type = getFieldType(value);
        const path = [...basePath, key];
        const id = path.join(".");

        if (type === "object") {
          return (
            <View key={id} style={styles.section}>
              <Text style={styles.sectionTitle}>
                {key.replace(/_/g, " ").toUpperCase()}
              </Text>
              {renderConfig(value, path)}
            </View>
          );
        }

        if (type === "boolean") {
          return (
            <View key={id} style={styles.card}>
              <Text style={styles.cardText}>{key}</Text>
              <Switch
                value={value}
                onValueChange={(val) =>
                  updateNestedConfig(path, val)
                }
              />
            </View>
          );
        }

        if (type === "number") {
          const draftKey = id;
          const draftValue =
            numberDrafts[draftKey] !== undefined
              ? numberDrafts[draftKey]
              : String(value);

          return (
            <View key={id} style={styles.card}>
              <Text style={styles.cardText}>{key}</Text>
              <TextInput
                value={draftValue}
                keyboardType={
                  Platform.OS === "ios"
                    ? "decimal-pad"
                    : "numeric"
                }
                style={styles.input}
                onChangeText={(text) => {
                  // allow typing freely
                  setNumberDrafts((prev) => ({
                    ...prev,
                    [draftKey]: text,
                  }));

                  // commit ONLY if valid number
                  if (
                    text !== "" &&
                    text !== "." &&
                    text !== "-" &&
                    !Number.isNaN(Number(text))
                  ) {
                    updateNestedConfig(path, Number(text));
                  }
                }}
                onBlur={() => {
                  // cleanup invalid drafts on blur
                  setNumberDrafts((prev) => {
                    const copy = { ...prev };
                    delete copy[draftKey];
                    return copy;
                  });
                }}
              />
            </View>
          );
        }


        if (type === "string") {
          return (
            <View key={id} style={styles.card}>
              <Text style={styles.cardText}>{key}</Text>
              <TextInput
                value={value}
                keyboardType="default"
                style={styles.input}
                onChangeText={(text) =>
                  updateNestedConfig(path, text)
                }
              />
            </View>
          );
        }

        if (type === "array") {
          return (
            <View key={id} style={styles.cardColumn}>
              <Text style={styles.cardText}>{key}</Text>
              <TextInput
                multiline
                value={JSON.stringify(value, null, 2)}
                style={styles.jsonInput}
                onChangeText={(text) => {
                  try {
                    updateNestedConfig(path, JSON.parse(text));
                  } catch {
                    // ignore invalid JSON while typing
                  }
                }}
              />
            </View>
          );
        }

        return null;
      });
  };


  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Loading config…</Text>
      </View>
    );
  }

  if (!config) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#ff5c5c" }}>No config found</Text>
      </View>
    );
  }

  const topLevelKeys = Object.keys(config).filter(
    (key) => !HIDDEN_TOP_LEVEL_KEYS.has(key)
  );

  function handleActivateDaily(){
    console.log("Created");
    setIsDailyActive(!isDailyActive);
  }
  async function handleSave(){
    console.log("NOTE :- ",note);
    if (!config || !selectedKey) return;

    try {
      setSaving(true);

      const sectionConfig = config[selectedKey];

      // await updateConfigSection(selectedKey, sectionConfig);

      const params = {
        note,
        category : selectedKey,
        newConfig : sectionConfig
      }
      console.log("params : ",params);
      await saveConfig(params);
      
      alert("Configuration updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  }
  const today = new Date();
  const formalDate = today.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  return (
    <ScrollView style={styles.container}>
        <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Hi Admin!</Text>
        <Text style={styles.subtitle}>Welcome back to your panel.</Text>
        <View style={styles.dailyTourBox}>
          <View>
            <Text style={styles.dailyTourMainText}>Create Daily Tournament</Text>
            <Text style={styles.dailyTourSecondaryText}>Date : {formalDate}</Text>
          </View>
          <TouchableOpacity
          style={isDailyActive ? styles.dailyTourButton : styles.dailyTourButtonDisabled}
          disabled={!isDailyActive}
          onPress={handleActivateDaily}>
            <Text 
            style={
              isDailyActive ? 
              styles.dailyTourButtonText : 
              {
                color:"#FFFFFF70",
              }}
            >
              CREATE
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={styles.dropdownText}>
            {selectedKey || "SELECT CONFIG SECTION"}
          </Text>
        </TouchableOpacity>

        {showDropdown &&
          topLevelKeys.map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedKey(key);
                setShowDropdown(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{key}</Text>
            </TouchableOpacity>
          ))}

        {selectedKey && (
          <View style={{ marginTop: 30 }}>
            <Text style={styles.selectedTitle}>
              {selectedKey.replace(/_/g, " ").toUpperCase()}
            </Text>

            {renderConfig(config[selectedKey], [selectedKey])}
          </View>
        )}

        <Text style={styles.noteTitle}>NOTE</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Enter notes..."
          value={note}
          onChangeText={(text) => {
            setNote(text);
          }}
        />
        {selectedKey && (
          <TouchableOpacity 
          style={styles.saveBtn} 
          onPress={handleSave}
          disabled={saving}>
            <Text style={styles.saveText}>
              {saving ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        )}
    </SafeAreaView>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: {
  },
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    padding: 20,
  },
  center: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 26,
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 5,
  },
  subtitle: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 16,
    marginBottom: 30,
  },
  dailyTourBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    // paddingHorizontal: 10,
    // borderWidth: 1,
    // borderColor: "#FFF"
  },
  dailyTourMainText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  dailyTourSecondaryText: {
    color: "#b8b8b8",
    fontSize: 15,
  },
  dailyTourButton: {
    backgroundColor: "#FFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  dailyTourButtonDisabled: {
    backgroundColor: "#ffffff40",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  dailyTourButtonText: {
    fontWeight: "800",
  },
  dropdown: {
    borderWidth: 2,
    borderColor: "#888",
    borderRadius: 14,
    padding: 16,
  },
  dropdownText: {
    color: "#fff",
    fontSize: 16,
  },
  dropdownItem: {
    backgroundColor: "#2b2b2b",
    padding: 14,
    borderRadius: 10,
    marginTop: 6,
  },
  dropdownItemText: {
    color: "#fff",
  },
  selectedTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  card: {
    backgroundColor: "#3a3a3a",
    borderRadius: 18,
    padding: 18,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardColumn: {
    backgroundColor: "#3a3a3a",
    borderRadius: 18,
    padding: 18,
    marginTop: 12,
  },
  cardText: {
    color: "#fff",
    fontSize: 15,
    flex: 1,
    marginRight: 10,
  },
  input: {
    backgroundColor: "#e5e5e5",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 90,
    textAlign: "center",
    fontWeight: "600",
  },
  jsonInput: {
    marginTop: 10,
    backgroundColor: "#e5e5e5",
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    fontSize: 14,
    textAlignVertical: "top",
  },
  noteTitle: {
    color: "#fff",
    marginTop: 24,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  noteInput: {
    backgroundColor: "#e5e5e5",
    borderRadius: 12,
    height: 60,
    padding: 12,
  },
  saveBtn: {
    backgroundColor: "#000",
    borderWidth: 2,
    borderColor: "#383838",
    marginVertical: 30,
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
