import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { getRooms, Room } from "../functions/storage";

const { width } = Dimensions.get("window");
const boxWidth = (width - 40) / 2;

const RoomsBoxes = () => {
  const navigation = useNavigation();
  const [roomsData, setRoomsData] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      console.log("Fetching rooms from storage...");
      try {
        const rooms = await getRooms();
        console.log("Rooms retrieved:", rooms);
        setRoomsData(rooms);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener("focus", fetchRooms);
    fetchRooms();

    return unsubscribe;
  }, [navigation]);

  const handlePress = (item: Room) => {
    navigation.navigate("RoomsInside", { room: item });
  };

  const handleAddRoom = () => {
    console.log("Add Room pressed");
    navigation.navigate("AddRoom");
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Loading rooms...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {}
      <View style={styles.header}>
        <Text style={styles.title}>Rooms</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddRoom}>
          <Icon name="plus" size={20} color="#4CAF50" />
          <Text style={styles.addText}>Add Room</Text>
        </TouchableOpacity>
      </View>

      {}
      {roomsData.length === 0 ? (
        <Text style={{ color: "#bbb", marginTop: 20, textAlign: "center" }}>
          No rooms created yet
        </Text>
      ) : (
        <FlatList
          data={roomsData}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.box}
              onPress={() => handlePress(item)}
            >
              <Icon name={item.icon} size={50} color="#4e8cff" />
              <Text style={styles.roomName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 15,
          }}
          scrollEnabled={false}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111827",
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  addText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "600",
  },
  box: {
    width: boxWidth,
    backgroundColor: "#201a30ff",
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  roomName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#E3E3E3",
    textAlign: "center",
  },
});

export default RoomsBoxes;
