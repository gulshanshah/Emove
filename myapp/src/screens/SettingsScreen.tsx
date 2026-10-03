import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Switch } from "react-native-switch";
import OptionModal from "../blocks/SettingsOptions";

import AccountOptions from "../blocks/AccountOptions";
import DevicesOptions from "../blocks/DevicesOptions";
import RoomsOptions from "../blocks/RoomsOptions";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const settingsCategories = [
    { id: "1", title: "Account", icon: "account-circle" },
    { id: "2", title: "Devices", icon: "devices" },
    { id: "3", title: "Rooms", icon: "home-group" },

    { id: "7", title: "Privacy & Security", icon: "shield-lock" },
  ];

  const extraSection = [
    { id: "1", title: "Help & Support", icon: "help-circle-outline" },
    { id: "2", title: "About App", icon: "information-outline" },
  ];

  const openModal = (title: string) => {
    setSelectedOption(title);
    setModalVisible(true);
  };

  const renderModalContent = () => {
    switch (selectedOption) {
      case "Account":
        return <AccountOptions />;
      case "Devices":
        return <DevicesOptions />;
      case "Rooms":
        return <RoomsOptions />;
      default:
        return (
          <Text style={{ color: "#fff", fontSize: 16 }}>
            No content available
          </Text>
        );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {}

        {}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={styles.avatar}
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>johndoe@example.com</Text>
          </View>
        </View>

        {}
        <View style={styles.settingsContainer}>
          {settingsCategories.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingsCard}
              onPress={() => openModal(item.title)}
            >
              <Icon name={item.icon} size={28} color="#4e8cff" />
              <Text style={styles.settingsTitle}>{item.title}</Text>
              <Icon
                name="chevron-right"
                size={28}
                color="#4e8cff"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
          ))}
        </View>

        {}
        <View style={styles.toggleContainer}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              disabled={false}
              activeText={""}
              inActiveText={""}
              circleSize={22}
              barHeight={26}
              circleBorderWidth={0}
              backgroundActive="#4e8cff"
              backgroundInactive="#ddd"
              circleActiveColor="#fff"
              circleInActiveColor="#fff"
              changeValueImmediately={true}
              innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
              renderInsideCircle={() => null}
              switchLeftPx={3.5}
              switchRightPx={3.5}
              switchWidthMultiplier={2}
              switchBorderRadius={16}
              animationDuration={100}
            />
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Dark Mode</Text>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              disabled={false}
              activeText={""}
              inActiveText={""}
              circleSize={22}
              barHeight={26}
              circleBorderWidth={0}
              backgroundActive="#4e8cff"
              backgroundInactive="#ddd"
              circleActiveColor="#fff"
              circleInActiveColor="#fff"
              changeValueImmediately={true}
              innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
              renderInsideCircle={() => null}
              switchLeftPx={3.5}
              switchRightPx={3.5}
              switchWidthMultiplier={2}
              switchBorderRadius={16}
              animationDuration={100}
            />
          </View>
        </View>

        {}
        <Text style={styles.extraTitle}>Extra</Text>
        <View style={styles.settingsContainer}>
          {extraSection.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingsCard}
              onPress={() => openModal(item.title)}
            >
              <Icon name={item.icon} size={28} color="#4e8cff" />
              <Text style={styles.settingsTitle}>{item.title}</Text>
              <Icon
                name="chevron-right"
                size={28}
                color="#4e8cff"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {}
      <OptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={selectedOption}
      >
        {renderModalContent()}
      </OptionModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827" },
  scrollContent: { padding: 20, paddingTop: 0, paddingBottom: 40 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "700" },

  profileCard: {
    flexDirection: "row",
    backgroundColor: "#201a30ff",
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  profileName: { color: "#fff", fontSize: 18, fontWeight: "600" },
  profileEmail: { color: "#A1A1A1", fontSize: 14 },

  settingsContainer: { marginBottom: 20 },
  settingsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#201a30ff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
  },
  settingsTitle: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 12 },

  toggleContainer: {
    backgroundColor: "#201a30ff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  toggleLabel: { color: "#fff", fontSize: 16, fontWeight: "600" },

  extraTitle: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 10 },
});
