import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";
import { saveRoom, Room } from "../functions/storage";

const iconSize = 50;
const iconBoxSize = 80;

const roomIcons = [
  "home", "sofa", "bed", "desk", "table-furniture", "armchair", "bookshelf", "wardrobe",
  "door", "garage", "television", "monitor", "speaker", "music", "fridge", "stove",
  "microwave", "shower", "bathtub", "lamp", "fan", "air-conditioner", "cctv", "shield-home",
];

export default function AddRoomScreen({ navigation }) {
  const [roomName, setRoomName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  useEffect(() => {
    setSelectedIcon(roomIcons[0]);
  }, []);

  const handleCreateRoom = async () => {
    if (!roomName.trim())
      return Alert.alert("Validation", "Please enter a room name.");
    if (!selectedIcon)
      return Alert.alert("Validation", "Please select an icon.");

    const newRoom: Room = {
      id: "",
      name: roomName.trim(),
      icon: selectedIcon,
      switches: [],
    };

    try {
      await saveRoom(newRoom);
      Alert.alert("Success", `Room "${newRoom.name}" added!`);
      navigation.goBack();
    } catch (err) {
      console.error("Error saving room:", err);
      Alert.alert("Error", "Could not save the room.");
    }
  };

  const renderIcon = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.iconBox, selectedIcon === item && styles.iconBoxSelected]}
      onPress={() => setSelectedIcon(item)}
      activeOpacity={0.8}
    >
      <Icon
        name={item}
        size={iconSize}
        color={selectedIcon === item ? "#fff" : "#9aa4b2"}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Room</Text>
        <View style={{ width: 28 }} />
      </View>

      {}
      <View style={styles.form}>
        <Text style={styles.label}>Room Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter room name"
          placeholderTextColor="#6b7280"
          value={roomName}
          onChangeText={setRoomName}
        />

        <Text style={styles.label}>Select Icon</Text>
        <FlatList
          data={roomIcons}
          renderItem={renderIcon}
          keyExtractor={(item) => item}
          numColumns={4}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </View>

      {}
      <TouchableOpacity
        style={styles.btnWrapper}
        onPress={handleCreateRoom}
        activeOpacity={0.85}
      >
        <LinearGradient colors={["#10b981", "#059669"]} style={styles.createBtn}>
          <Text style={styles.btnText}>Create Room</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1724" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#111827",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#fff" },
  form: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#9aa4b2", marginBottom: 8 },
  input: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    fontSize: 16,
    borderColor: "#322d79",
    borderWidth: 1,
    marginBottom: 20,
  },
  iconBox: {
    width: iconBoxSize,
    height: iconBoxSize,
    marginVertical: 8,
    borderRadius: 15,
    backgroundColor: "#1f2937",
    justifyContent: "center",
    alignItems: "center",
  },
  iconBoxSelected: { backgroundColor: "#10b981" },
  btnWrapper: { position: "absolute", bottom: 20, left: 20, right: 20 },
  createBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 6,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
