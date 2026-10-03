import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AccountOptions() {
  return (
    <View>
      <Text style={styles.heading}>Account Settings</Text>
      <Text style={styles.text}>• Change Name / Email / Password</Text>
      <Text style={styles.text}>• Linked Accounts</Text>
      <Text style={styles.text}>• Security Settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 12 },
  text: { fontSize: 16, color: "#ccc", marginBottom: 8 },
});
