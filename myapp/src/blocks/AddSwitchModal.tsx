import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
  UIManager,
  findNodeHandle,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getHubs, Hub, Switch, addSwitchToRoom } from "../functions/storage";

const ITEM_HEIGHT = 45;
const VISIBLE_ITEMS = 4;

const materialIcons = [
  "lightbulb-on", "fan", "thermometer", "fridge", "power-plug",
  "air-conditioner", "tv", "speaker", "coffee", "lamp",
  "washing-machine", "oven", "microwave", "blender", "water-pump",
];

interface AddSwitchModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd?: () => void;
  roomId: string;
  roomName: string;
}

const AddSwitchModal: React.FC<AddSwitchModalProps> = ({
  visible,
  onClose,
  onAdd,
  roomId,
  roomName,
}) => {
  const [availableHubs, setAvailableHubs] = useState<Hub[]>([]);
  const [selectedHub, setSelectedHub] = useState<Hub | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [switchName, setSwitchName] = useState<string>("");
  const [power, setPower] = useState<string>("");
  const [selectedIcon, setSelectedIcon] = useState(materialIcons[0]);

  const [hubDropdown, setHubDropdown] = useState(false);
  const [slotDropdown, setSlotDropdown] = useState(false);
  const [hubDropdownTop, setHubDropdownTop] = useState(0);
  const [slotDropdownTop, setSlotDropdownTop] = useState(0);

  const hubRef = useRef<TouchableOpacity>(null);
  const slotRef = useRef<TouchableOpacity>(null);

  useEffect(() => {
    const fetchHubs = async () => {
      const hubs = await getHubs();
      setAvailableHubs(hubs);
    };
    fetchHubs();
  }, []);

  useEffect(() => {
    if (visible) {
      console.log("Modal Opened for Room:", roomName, "| Room ID:", roomId);
    }
  }, [visible, roomName, roomId]);

  if (!visible) return null;

  const openHubDropdown = () => {
    if (hubRef.current) {
      UIManager.measure(
        findNodeHandle(hubRef.current),
        (fx, fy, w, h, px, py) => {
          setHubDropdownTop(py + h);
          setHubDropdown(true);
          setSlotDropdown(false);
        }
      );
    }
  };

  const openSlotDropdown = () => {
    if (slotRef.current) {
      UIManager.measure(
        findNodeHandle(slotRef.current),
        (fx, fy, w, h, px, py) => {
          setSlotDropdownTop(py + h);
          setSlotDropdown(true);
          setHubDropdown(false);
        }
      );
    }
  };

  const handleAdd = async () => {
    if (!selectedHub || !selectedSlot || !switchName.trim() || !selectedIcon) {
      Alert.alert("Validation", "Please fill all required fields");
      return;
    }

    const numericPower = power ? parseFloat(power) : 0;
    if (power && isNaN(numericPower)) {
      Alert.alert("Validation", "Power must be a number");
      return;
    }

    const newSwitch: Switch = {
      id: Date.now().toString(),
      name: switchName.trim(),
      hub: selectedHub.id,
      num: selectedHub.remains.indexOf(selectedSlot) + 1,
      icon: selectedIcon,
      power: numericPower,
    };

    try {

      console.log("Adding Switch:", newSwitch.name);
      console.log("To Room:", roomName, "| Room ID:", roomId);

      await addSwitchToRoom(roomName, selectedHub.id, selectedSlot, newSwitch);
      Alert.alert("Success", `${switchName} added to ${roomName}`);

      setSelectedHub(null);
      setSelectedSlot(null);
      setSwitchName("");
      setPower("");
      setSelectedIcon(materialIcons[0]);

      if (onAdd) onAdd();
      onClose();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not save switch");
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setHubDropdown(false);
        setSlotDropdown(false);
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentFull}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Switch</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
            {}
            <Text style={styles.label}>Select Hub</Text>
            <TouchableOpacity
              ref={hubRef}
              style={styles.dropdown}
              onPress={openHubDropdown}
            >
              <Text style={{ color: selectedHub ? "#fff" : "#888" }}>
                {selectedHub ? selectedHub.name : "Select Hub"}
              </Text>
              <Ionicons
                name={hubDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>

            {}
            <Text style={styles.label}>Select Remaining Slot</Text>
            <TouchableOpacity
              ref={slotRef}
              style={styles.dropdown}
              onPress={openSlotDropdown}
              disabled={!selectedHub}
            >
              <Text style={{ color: selectedSlot ? "#fff" : "#888" }}>
                {selectedSlot ||
                  (selectedHub ? "Select Slot" : "Select a hub first")}
              </Text>
              <Ionicons
                name={slotDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>

            {}
            <Text style={styles.label}>Switch Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter switch name"
              placeholderTextColor="#888"
              value={switchName}
              onChangeText={setSwitchName}
            />

            {}
            <Text style={styles.label}>Power (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter power"
              placeholderTextColor="#888"
              value={power}
              onChangeText={setPower}
              keyboardType="numeric"
            />

            {}
            <Text style={styles.label}>Select Icon</Text>
            <FlatList
              data={materialIcons}
              keyExtractor={(item) => item}
              numColumns={4}
              contentContainerStyle={{
                paddingHorizontal: 5,
                paddingVertical: 10,
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.iconOption,
                    selectedIcon === item && styles.optionSelected,
                  ]}
                  onPress={() => setSelectedIcon(item)}
                >
                  <Icon
                    name={item}
                    size={30}
                    color={selectedIcon === item ? "#fff" : "#ccc"}
                  />
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addButtonText}>Add Switch</Text>
            </TouchableOpacity>
          </ScrollView>

          {}
          {hubDropdown && (
            <View
              style={[
                styles.dropdownListAbsolute,
                { top: hubDropdownTop, maxHeight: ITEM_HEIGHT * VISIBLE_ITEMS },
              ]}
            >
              <ScrollView>
                {availableHubs.map((hub) => (
                  <TouchableOpacity
                    key={hub.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedHub(hub);
                      setHubDropdown(false);
                      setSelectedSlot(null);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{hub.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {}
          {slotDropdown && selectedHub && (
            <View
              style={[
                styles.dropdownListAbsolute,
                { top: slotDropdownTop, maxHeight: ITEM_HEIGHT * VISIBLE_ITEMS },
              ]}
            >
              <ScrollView>
                {selectedHub.remains.map((sw) => (
                  <TouchableOpacity
                    key={sw}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedSlot(sw);
                      setSlotDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{sw}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)" },
  modalContentFull: {
    flex: 1,
    backgroundColor: "#201a30ff",
    padding: 15,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  modalTitle: { fontSize: 22, fontWeight: "700", color: "#fff" },
  label: { color: "#ccc", marginVertical: 8, fontSize: 14 },
  dropdown: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 10,
    color: "#fff",
    marginBottom: 10,
  },
  iconOption: {
    flex: 1,
    maxWidth: "23%",
    aspectRatio: 1,
    backgroundColor: "#333",
    margin: "1%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  optionSelected: { backgroundColor: "#4e8cff" },
  addButton: {
    backgroundColor: "#4e8cff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  dropdownListAbsolute: {
    position: "absolute",
    width: "90%",
    left: "5%",
    backgroundColor: "#444",
    borderRadius: 8,
    zIndex: 9999,
  },
  dropdownItem: {
    padding: 10,
    borderBottomColor: "#555",
    borderBottomWidth: 1,
  },
  dropdownItemText: { color: "#fff" },
});

export default AddSwitchModal;
