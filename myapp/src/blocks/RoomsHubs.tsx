import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { getHubs, Hub } from "../functions/storage";

const { width } = Dimensions.get("window");
const boxWidth = (width - 40) / 2;

const RoomsHubs = ({ isActive }: { isActive: boolean }) => {
  const navigation = useNavigation<any>();
  const [hubs, setHubs] = useState<Hub[]>([]);

  const fetchHubs = async () => {
    console.log("Fetching hubs from storage...");
    const storedHubs = await getHubs();
    console.log("Hubs retrieved:", storedHubs);
    setHubs(storedHubs);
  };

  useEffect(() => {
    if (isActive) {
      fetchHubs();
    }
  }, [isActive]);

  return (
    <View style={styles.container}>
      {}
      <View style={styles.header}>
        <Text style={styles.title}>Hubs</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("AddHub")}>
          <Icon name="add" size={20} color="#10b981" />
          <Text style={styles.addText}>Add Hub</Text>
        </TouchableOpacity>
      </View>

      {}
      <FlatList
        data={hubs}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.box}
            onPress={() => navigation.navigate("HubInside", { hubId: item.id })}
          >
            <Icon name={item.icon} size={50} color="#4e8cff" />
            <Text style={styles.hubName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 15 }}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", paddingHorizontal: 10, marginVertical: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#111827", paddingVertical: 5, paddingHorizontal: 5 },
  title: { fontSize: 20, fontWeight: "700", color: "#fff" },
  addBtn: { flexDirection: "row", alignItems: "center" },
  addText: { marginLeft: 5, fontSize: 16, color: "#10b981", fontWeight: "600" },
  box: { width: boxWidth, backgroundColor: "#201a30ff", borderRadius: 15, paddingVertical: 20, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  hubName: { marginTop: 10, fontSize: 16, fontWeight: "600", color: "#E3E3E3", textAlign: "center" },
});

export default RoomsHubs;
