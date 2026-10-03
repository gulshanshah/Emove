import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

import HomeScreen from "../screens/HomeScreen";
import RoomsScreen from "../screens/RoomsScreen";
import EnergyScreen from "../screens/EnergyScreen";
import SettingsScreen from "../screens/SettingsScreen";

import MicOverlay from "./MicOverlay";
import HomeHead from "../blocks/HomeHead";

import HubInside from "../blocks/HubInside";

import RoomsInside from "../blocks/RoomsInside";
import Schedules from "../blocks/Schedules";
import AddHubScreen from "../blocks/RoomsAddHub";
import AddRoomScreen from "../blocks/RoomsAddRoom";

const Stack = createStackNavigator();

function MainTabs() {
  const [activeTab, setActiveTab] = useState("Home");
  const [showMicOverlay, setShowMicOverlay] = useState(false);

  const navigation = useNavigation();

  const tabs = [
    { id: "Home", label: "Home", icon: "home-outline" },
    { id: "Rooms", label: "Rooms", icon: "grid-outline" },
    { id: "Energy", label: "Energy", icon: "flash-outline" },
    { id: "Settings", label: "Settings", icon: "settings-outline" },
    { id: "Mic", label: "", icon: "mic" },
  ];

  const renderScreen = () => {
    switch (activeTab) {
      case "Home":
        return <HomeScreen />;
      case "Rooms":
        return <RoomsScreen />;
      case "Energy":
        return <EnergyScreen />;
      case "Settings":
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {}
      <HomeHead
        title={activeTab}
        showBack={false}
        rightIcon={activeTab === "Rooms" ? "add-circle-outline" : undefined}
        onRightPress={() => console.log("Right icon pressed")}
      />

      {}
      <View style={{ flex: 1 }}>{renderScreen()}</View>

      {showMicOverlay && <MicOverlay onClose={() => setShowMicOverlay(false)} />}

      {}
      <View style={styles.container}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, tab.id === "Mic" && styles.micWrapper]}
            onPress={() =>
              tab.id === "Mic" ? setShowMicOverlay(true) : setActiveTab(tab.id)
            }
          >
            <View style={tab.id === "Mic" ? styles.micButton : null}>
              <Icon
                name={tab.icon}
                size={tab.id === "Mic" ? 28 : 27}
                color={
                  tab.id === "Mic"
                    ? "#fff"
                    : activeTab === tab.id
                    ? "#3B82F6"
                    : "#9CA3AF"
                }
              />
            </View>
            {tab.label !== "" && tab.id !== "Mic" && (
              <Text
                style={[
                  styles.label,
                  { color: activeTab === tab.id ? "#3B82F6" : "#9CA3AF" },
                ]}
              >
                {tab.label}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function BottomTabsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="RoomsInside" component={RoomsInside} />
      <Stack.Screen name="Schedules" component={Schedules} />
      <Stack.Screen name="AddHub" component={AddHubScreen} />
      <Stack.Screen name="AddRoom" component={AddRoomScreen} />
      <Stack.Screen name="HubInside" component={HubInside} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#0d1117",
    borderTopWidth: 1,
    borderTopColor: "#1f2937",
    paddingVertical: 8,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 5,
  },
  tabButton: { alignItems: "center" },
  label: { fontSize: 12, marginTop: 2 },
  micWrapper: { top: -20 },
  micButton: {
    backgroundColor: "#3B82F6",
    padding: 14,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
});
