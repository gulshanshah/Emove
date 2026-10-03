import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import HomeHorizontalStripe from "../blocks/HomeHorizontalStripe";
import HomeActionBoxes from "../blocks/HomeActionBoxes";
import HomeActionStripes from "../blocks/HomeActionStripes";

export default function HomeScreen() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HomeHorizontalStripe onRoomSelect={setSelectedRoom} />
        <HomeActionBoxes roomName={selectedRoom} />
        <HomeActionStripes />
        <Text style={styles.text}></Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  scrollContent: {
    alignItems: "center",

  },
  text: {
    color: "#fff",
    fontSize: 24,
  },
});
