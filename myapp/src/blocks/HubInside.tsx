import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Animated,
  Easing,
  StatusBar,
  Alert,
  FlatList,
  LogBox,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Switch } from "react-native-switch";
import {
  getHubById,
  Hub,
  getSwitchesByHubId,
  Switch as HubSwitch,
} from "../functions/storage";

const { width } = Dimensions.get("window");
const boxWidth = (width - 50) / 2; 

const HubInside = ({ route, navigation }: any) => {
  const hubId = route?.params?.hubId;

  const [hub, setHub] = useState<Hub | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  
  const [wifiModalVisible, setWifiModalVisible] = useState(false);
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");

  const [hubRooms, setHubRooms] = useState<
    { roomName: string; switches: HubSwitch[] }[]
  >([]);

  
  const [espStates, setEspStates] = useState<number[]>(Array(8).fill(0));
  const [espRuntimes, setEspRuntimes] = useState<number[]>(Array(8).fill(0));

  useEffect(() => {
  LogBox.ignoreLogs([
    "useInsertionEffect must not schedule updates",
  ]);
}, []);

  
  useEffect(() => {
    const fetchHub = async () => {
      if (!hubId) return;
      const h = await getHubById(hubId);
      if (h) setHub(h);
    };
    fetchHub();
  }, [hubId]);

  
  const startPulse = () => {
    scaleAnim.setValue(1);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
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

  
  const handleConnectOffline = async () => {
    setStep(2);
    setScanError(null);
    startPulse();

    setTimeout(async () => {
      try {
        const response = await fetch("http://192.168.4.1/states", {
          timeout: 5000,
        });

        if (response.ok) {
          const data = await response.json();
          setEspStates(data.switches || Array(8).fill(0));
          setIsConnected(true);
          setStep(3);
        } else {
          setScanError(
            "Could not connect to hub. Make sure you're connected to the hub's Wi-Fi."
          );
          setStep(1);
        }
      } catch (err) {
        console.error(err);
        setScanError(
          "Error connecting to hub. Make sure you're connected to the hub's Wi-Fi."
        );
        setStep(1);
      }
    }, 2000);
  };

  
  const fetchHubSwitches = async () => {
    if (!hub) return;
    const data = await getSwitchesByHubId(hub.id);
    setHubRooms(data);
  };

  useEffect(() => {
    if (step === 3) fetchHubSwitches();
  }, [step, hub]);

  
  const fetchSwitchStates = async () => {
    try {
      const response = await fetch(`http://192.168.4.1/states`);
      const data = await response.json();

      if (data.switches) setEspStates(data.switches);
      if (data.runtime) setEspRuntimes(data.runtime);
    } catch (err) {
      console.log("ESP32 fetch error:", err);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    if (step === 3) {
      fetchSwitchStates();
      const interval = setInterval(fetchSwitchStates, 3000);
      return () => clearInterval(interval);
    }
  }, [step, hub]);

  
  const handleSaveWifi = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("ssid", ssid);
      formData.append("password", password);

      const response = await fetch(`http://192.168.4.1/savewifi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (response.ok) {
        Alert.alert(
          "Success",
          "Wi-Fi configuration saved! The hub will restart and try to connect."
        );
        setWifiModalVisible(false);
      } else {
        Alert.alert("Error", "Failed to save Wi-Fi configuration");
      }
    } catch (err) {
      console.error("ESP32 Wi-Fi save error:", err);
      Alert.alert("Error", "Cannot save Wi-Fi configuration");
    }
  };

  
  const SwitchBox = ({
    sw,
    showToggle = false,
    roomName,
  }: {
    sw: HubSwitch;
    showToggle?: boolean;
    roomName?: string;
  }) => {
    const [isOn, setIsOn] = useState(false);

    
    useEffect(() => {
      if (espStates[sw.num] !== undefined) {
        setIsOn(espStates[sw.num] === 0);
      }
    }, [espStates]);

    const toggleSwitch = async () => {
  console.log("Toggling switch:", sw.num);  
  try {
    const res = await fetch(`http://192.168.4.1/toggle?i=${sw.num}`);
    console.log("Toggle response", await res.text());
    await fetchSwitchStates();
  } catch (err) {
    console.error("ESP32 toggle error:", err);
    Alert.alert("Error", "Cannot communicate with hub");
  }
};


    return (
      <View style={styles.switchBox}>
        <Icon
          name={sw.icon || "light-switch"}
          size={50}
          color={isOn ? "#4e8cff" : "#A1A1A1"}
        />
        <Text style={styles.switchName}>{sw.name}</Text>
        {showToggle && (
          <Switch
            value={isOn}
            onValueChange={toggleSwitch}
            disabled={false}
            activeText={""}
            inActiveText={""}
            circleSize={28}
            barHeight={32}
            circleBorderWidth={0}
            backgroundActive="#4e8cff"
            backgroundInactive="#ddd"
            circleActiveColor="#fff"
            circleInActiveColor="#fff"
            changeValueImmediately={true}
            switchLeftPx={3.5}
            switchRightPx={3.5}
            switchWidthMultiplier={2}
            switchBorderRadius={16}
            animationDuration={100}
          />
        )}
      </View>
    );
  };

  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{hub?.name || "Hub"}</Text>
        <View style={styles.connectionStatus}>
          <Icon
            name={isConnected ? "wifi" : "wifi-off"}
            size={20}
            color={isConnected ? "#4ade80" : "#6b7280"}
          />
        </View>
      </View>

      {}
      {step === 1 && hub && (
        <FlatList
          data={hub.remains.map((slot) => ({
            id: slot,
            name: `Switch ${slot}`,
            icon: "light-switch",
            num: parseInt(slot),
          }))}
          renderItem={({ item }) => <SwitchBox sw={item as HubSwitch} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ padding: 16 }}
          ListHeaderComponent={
            <>
              <View style={styles.hubInfo}>
                <Text style={styles.hubLabel}>Hub ID:</Text>
                <Text style={styles.hubValue}>{hub?.id}</Text>
                <Text style={[styles.hubLabel, { marginLeft: 16 }]}>
                  Capacity:
                </Text>
                <Text style={styles.hubValue}>{hub?.capacity}</Text>
              </View>
              <Text style={styles.sectionTitle}>Remaining Switches</Text>
            </>
          }
          ListFooterComponent={
            <TouchableOpacity
              style={[styles.connectButton, { marginTop: 20 }]}
              onPress={handleConnectOffline}
            >
              <Text style={styles.connectButtonText}>Connect to Hub</Text>
            </TouchableOpacity>
          }
        />
      )}

      {}
      {step === 2 && (
        <View style={styles.scanContainer}>
          <Text style={styles.scanTitle}>Connecting to Hub...</Text>
          <Text style={styles.scanSubtitle}>
            Please make sure you're connected to the hub's Wi-Fi network
          </Text>
          <Animated.View
            style={[styles.scanCircle, { transform: [{ scale: scaleAnim }] }]}
          >
            <Icon name="wifi" size={40} color="#FFF" />
          </Animated.View>
          {scanError && <Text style={styles.scanError}>{scanError}</Text>}
        </View>
      )}

      {}
      {step === 3 && (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={styles.connectionInfo}>
            <Icon
              name={isConnected ? "wifi" : "wifi-off"}
              size={24}
              color={isConnected ? "#4ade80" : "#6b7280"}
            />
            <Text style={styles.connectionText}>
              {isConnected ? "Connected to Hub" : "Disconnected from Hub"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.connectButton}
            onPress={() => setWifiModalVisible(true)}
          >
            <Text style={styles.connectButtonText}>Configure Wi-Fi</Text>
          </TouchableOpacity>

          {hubRooms.map((room) => (
            <View key={room.roomName} style={{ marginTop: 20 }}>
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 16,
                  fontWeight: "600",
                  marginBottom: 10,
                }}
              >
                {room.roomName}
              </Text>
              <FlatList
                data={room.switches}
                renderItem={({ item }) => (
                  <SwitchBox sw={item} showToggle roomName={room.roomName} />
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
              />
            </View>
          ))}
        </ScrollView>
      )}

      {}
      <Modal visible={wifiModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Configure Wi-Fi</Text>

            <Text style={styles.inputLabel}>SSID</Text>
            <TextInput
              style={styles.input}
              value={ssid}
              onChangeText={setSsid}
              placeholder="Wi-Fi SSID"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Wi-Fi Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveWifi}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setWifiModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#FFF" },
  connectionStatus: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  hubInfo: { flexDirection: "row", padding: 16 },
  hubLabel: { color: "#9CA3AF", fontWeight: "500" },
  hubValue: { color: "#FFF", fontWeight: "600", marginRight: 10 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 10,
  },
  switchBox: {
    width: boxWidth,
    backgroundColor: "#201a30ff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginVertical: 8,
  },
  switchName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#E3E3E3",
    textAlign: "center",
  },
  connectButton: {
    backgroundColor: "#6366F1",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  connectButtonText: { color: "#FFF", fontWeight: "600", fontSize: 16 },
  scanContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  scanTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  scanSubtitle: {
    fontSize: 16,
    color: "#D1D5DB",
    marginBottom: 30,
    textAlign: "center",
  },
  scanCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },
  scanError: { color: "#F87171", marginTop: 20, textAlign: "center" },
  connectionInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#374151",
    borderRadius: 8,
  },
  connectionText: { color: "#FFF", marginLeft: 8, fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#1F2937",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "50%",
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 16,
  },
  inputLabel: { color: "#9CA3AF", marginBottom: 6 },
  input: {
    backgroundColor: "#374151",
    padding: 14,
    borderRadius: 10,
    color: "#FFF",
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#4e8cff",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: { color: "#FFF", fontWeight: "600" },
  cancelButton: {
    backgroundColor: "#374151",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: { color: "#FFF", fontWeight: "600" },
});

export default HubInside;
