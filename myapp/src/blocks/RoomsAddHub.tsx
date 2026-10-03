import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Animated,
  Easing,
  SafeAreaView,
  StatusBar,
  PermissionsAndroid,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { NetworkInfo } from "react-native-network-info";
import { saveHub, Hub } from "../functions/storage";

const iconList = [
  "lightbulb-outline","tv","ac-unit","router","speaker",
  "toys","computer","gamepad","lamp","wifi","kitchen",
  "bed","power","radio","microwave","shower","phone-android",
  "door-front","battery-charging-full","fan",
];

export default function HubSetupScreen({ navigation }: any) {
  const [step, setStep] = useState<"scanning" | "config">("scanning");
  const [hubData, setHubData] = useState<{ id: string } | null>(null);
  const [hubName, setHubName] = useState("");
  const [switchCount, setSwitchCount] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("router");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (step === "scanning") {
      startPulse();
      scanForHub();
    }
  }, [step]);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.4,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "App needs location permission to detect Wi-Fi SSID",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn("⚠️ Permission error:", err);
      return false;
    }
  };

  const scanForHub = async () => {
    setError(null);
    setHubData(null);

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setError("Location permission is required to detect Wi-Fi SSID.");
      return;
    }

    setTimeout(async () => {
      try {
        const ssid = await NetworkInfo.getSSID();

        if (ssid && ssid.startsWith("Utsav ")) {
          const hubId = ssid.replace("Utsav ", "");
          const match = hubId.match(/^hub(\d{2})/);
          const switches = match ? parseInt(match[1], 10) : 8;

          setSwitchCount(switches.toString());
          setHubData({ id: hubId });
          setStep("config");
        } else {
          setError("No Utsav devices found. Make sure you are connected to the hub WiFi.");
        }
      } catch (e) {
        setError("Could not read Wi-Fi SSID. Check permissions.");
      }
    }, 2000);
  };

  const handleConnect = () => {
    if (!hubData) return;

    setIsConnecting(true);

    setTimeout(() => {
      const capacity = parseInt(switchCount, 10);
      const remains = Array.from({ length: capacity }, (_, i) => (i + 1).toString());

      const newHub: Hub = {
        id: hubData.id,
        name: hubName || hubData.id,
        icon: selectedIcon,
        capacity,
        remains,
      };

      saveHub(newHub);

      setIsConnecting(false);
      alert(`Hub "${newHub.name}" connected successfully!`);
      navigation.goBack();
    }, 2000);
  };

  const canConnect = !!selectedIcon && !!hubData;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{step === "scanning" ? "Scanning" : "Configure Hub"}</Text>
        <View style={{ width: 24 }} />
      </View>

      {}
      {step === "scanning" && (
        <View style={styles.centerContent}>
          <Text style={styles.title}>Scanning for Hubs</Text>
          <Text style={styles.subtitle}>Please wait while we check your Wi-Fi connection...</Text>
          <Animated.View style={[styles.scanCircle, { transform: [{ scale: scaleAnim }] }]}>
            <Icon name="wifi" size={40} color="#FFF" />
          </Animated.View>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      )}

      {}
      {step === "config" && hubData && (
        <View style={styles.flexContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.hubCard}>
              <Icon name={selectedIcon} size={40} color="#6366F1" />
              <Text style={styles.hubId}>{hubData.id}</Text>
            </View>

            <Text style={styles.sectionTitle}>Hub Configuration</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Hub Name (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter a name for your hub"
                placeholderTextColor="#9CA3AF"
                value={hubName}
                onChangeText={setHubName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Number of Switches</Text>
              <TextInput style={styles.input} value={switchCount} editable={false} />
            </View>

            <Text style={styles.sectionTitle}>Select Icon</Text>
            <View style={styles.iconGrid}>
              {iconList.map((icon, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.iconOption, selectedIcon === icon && styles.iconOptionSelected]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Icon name={icon} size={28} color={selectedIcon === icon ? "#FFF" : "#9CA3AF"} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.connectButton, !canConnect && styles.connectButtonDisabled]}
              onPress={handleConnect}
              disabled={!canConnect || isConnecting}
            >
              <Text style={styles.connectButtonText}>
                {isConnecting ? "Connecting..." : "Connect Hub"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#374151" },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#FFF" },
  flexContainer: { flex: 1 },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8, color: "#FFF", textAlign: "center" },
  subtitle: { fontSize: 16, color: "#D1D5DB", marginBottom: 30, textAlign: "center", lineHeight: 22 },
  scanCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#6366F1", justifyContent: "center", alignItems: "center", marginTop: 40 },
  errorText: { marginTop: 20, fontSize: 14, color: "#F87171", textAlign: "center" },
  hubCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#1F2937", padding: 16, borderRadius: 12, marginBottom: 24 },
  hubId: { fontSize: 18, fontWeight: "600", color: "#FFF", marginLeft: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#FFF", marginBottom: 16 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 16, fontWeight: "500", color: "#D1D5DB", marginBottom: 8 },
  input: { backgroundColor: "#1F2937", borderWidth: 1, borderColor: "#374151", borderRadius: 8, padding: 16, fontSize: 16, color: "#FFF" },
  iconGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 20 },
  iconOption: { width: 60, height: 60, justifyContent: "center", alignItems: "center", backgroundColor: "#1F2937", borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: "#374151" },
  iconOptionSelected: { backgroundColor: "#6366F1", borderColor: "#6366F1" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: "#1F2937", borderTopWidth: 1, borderTopColor: "#374151" },
  connectButton: { backgroundColor: "#6366F1", padding: 16, borderRadius: 12, alignItems: "center" },
  connectButtonDisabled: { backgroundColor: "#4B5563" },
  connectButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});
