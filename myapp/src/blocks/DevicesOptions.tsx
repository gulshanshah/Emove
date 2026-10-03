import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const availableRooms = ["Living Room", "Bedroom", "Kitchen", "Office"];

const initialDevices = [
  {
    id: "PH12345",
    deviceName: "iPhone 14",
    userName: "John Doe",
    userEmail: "john@example.com",
    access: "Living Room, Bedroom",
  },
  {
    id: "PH67890",
    deviceName: "Galaxy S22",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    access: "Kitchen",
  },
  {
    id: "PH11223",
    deviceName: "iPad Pro",
    userName: "Alice Brown",
    userEmail: "alice@example.com",
    access: "Bedroom, Office",
  },
];

export default function DevicesOptions() {
  const [devices, setDevices] = useState(initialDevices);
  const [showAddForm, setShowAddForm] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  const toggleRoom = (room: string) => {
    if (selectedRooms.includes(room)) {
      setSelectedRooms(selectedRooms.filter((r) => r !== room));
    } else {
      setSelectedRooms([...selectedRooms, room]);
    }
  };

  const handleAddDevice = () => {
    if (!email) return alert("Please enter an email");
    if (selectedRooms.length === 0) return alert("Select at least one room");

    const newDevice = {
      id: `PH${Math.floor(Math.random() * 100000)}`,
      deviceName: "New Device",
      userName: email.split("@")[0],
      userEmail: email,
      access: selectedRooms.join(", "),
    };
    setDevices([newDevice, ...devices]);
    setShowAddForm(false);
    setEmail("");
    setSelectedRooms([]);
  };

  const handleEdit = (deviceId: string) => {
    console.log("Edit device:", deviceId);

  };

  return (
    <View style={styles.container}>
      {}
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Connected Devices</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Device</Text>
        </TouchableOpacity>
      </View>

      {}
      {showAddForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formHeading}>Add New Device</Text>

          <TextInput
            style={styles.input}
            placeholder="User Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Select Rooms:</Text>
          <FlatList
            data={availableRooms}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.roomOption,
                  selectedRooms.includes(item) && styles.roomSelected,
                ]}
                onPress={() => toggleRoom(item)}
              >
                <Text
                  style={[
                    styles.roomText,
                    selectedRooms.includes(item) && { color: "#fff" },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowAddForm(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={handleAddDevice}>
              <Ionicons name="add-circle-outline" size={18} color="#fff" />
              <Text style={styles.addBtnText}>Add Device</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {}
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.deviceCard}>
            {}
            <TouchableOpacity
              style={styles.editIcon}
              onPress={() => handleEdit(item.id)}
            >
              <Ionicons name="pencil-outline" size={20} color="#4e8cff" />
            </TouchableOpacity>

            <Text style={styles.deviceName}>{item.deviceName}</Text>
            <Text style={styles.info}>Device ID: {item.id}</Text>
            <Text style={styles.info}>User: {item.userName}</Text>
            <Text style={styles.info}>Email: {item.userEmail}</Text>
            <Text style={styles.info}>Room Access: {item.access}</Text>
          </View>
        )}
        style={{ marginTop: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 0, marginBottom: 0 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  heading: { fontSize: 20, fontWeight: "700", color: "#fff" },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  addButtonText: { color: "#fff", marginLeft: 5, fontWeight: "600" },

  formContainer: {
    backgroundColor: "#201a30ff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  formHeading: { fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#fff",
    marginBottom: 10,
  },
  label: { fontSize: 16, color: "#ccc", marginBottom: 8 },
  roomOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 20,
    marginRight: 10,
  },
  roomSelected: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  roomText: { color: "#ccc" },
  buttonsRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12, alignItems: "center", gap: 8 },
  cancelBtn: { marginRight: 10 },
  cancelText: { color: "#ff4d4d", fontWeight: "600" },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addBtnText: { color: "#fff", marginLeft: 5, fontWeight: "600" },

  deviceCard: {
    backgroundColor: "#201a30ff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    position: "relative",
  },
  editIcon: { position: "absolute", top: 10, right: 10, padding: 5 },
  deviceName: { fontSize: 18, fontWeight: "600", color: "#E3E3E3", marginBottom: 5 },
  info: { fontSize: 14, color: "#A1A1A1", marginBottom: 3 },
});
