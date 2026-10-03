import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RoomsOptions() {
  const [storageData, setStorageData] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllStorageData();
  }, []);

  const fetchAllStorageData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const stores = await AsyncStorage.multiGet(keys);

      const data: { [key: string]: any } = {};
      stores.forEach(([key, value]) => {
        try {
          data[key] = value ? JSON.parse(value) : null;
        } catch {
          data[key] = value;
        }
      });

      setStorageData(data);
    } catch (err) {
      console.error("Failed to read AsyncStorage:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderValue = (value: any) => {
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>AsyncStorage Viewer</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchAllStorageData}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : Object.keys(storageData).length === 0 ? (
          <Text style={styles.loadingText}>No data found in AsyncStorage</Text>
        ) : (
          Object.entries(storageData).map(([key, value]) => (
            <View key={key} style={styles.item}>
              <Text style={styles.itemKey}>{key}</Text>
              <Text style={styles.itemValue}>{renderValue(value)}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  headerText: { color: "#FFF", fontSize: 20, fontWeight: "600" },
  refreshButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#6366F1", borderRadius: 8 },
  refreshText: { color: "#FFF", fontWeight: "600" },
  scrollContent: { padding: 16 },
  loadingText: { color: "#D1D5DB", textAlign: "center", marginTop: 20 },
  item: { marginBottom: 20, padding: 12, backgroundColor: "#1F2937", borderRadius: 12 },
  itemKey: { color: "#6366F1", fontWeight: "600", marginBottom: 6 },
  itemValue: { color: "#FFF", fontFamily: "Courier" },
});
