import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ConnectionStatus = () => {
  const [stateIndex, setStateIndex] = useState(0);
  const [signalStrength, setSignalStrength] = useState(4);
  const [modalVisible, setModalVisible] = useState(false);

  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setStateIndex((prev) => (prev + 1) % 4);
      if (stateIndex === 1) {
        setSignalStrength((prev) => (prev > 1 ? prev - 1 : 4));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [stateIndex]);

  useEffect(() => {
    if (stateIndex === 2) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.stopAnimation();
      spinAnim.setValue(0);
    }
  }, [stateIndex]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const getWifiIcon = () => {
    switch (stateIndex) {
      case 0:
        return "wifi-strength-off";
      case 1:
        switch (signalStrength) {
          case 4:
            return "wifi-strength-4";
          case 3:
            return "wifi-strength-3";
          case 2:
            return "wifi-strength-2";
          case 1:
            return "wifi-strength-1";
          default:
            return "wifi-strength-outline";
        }
      case 2:
        return "loading";
      case 3:
        return "wifi";
      default:
        return "wifi-strength-outline";
    }
  };

  const getWifiColor = () => {
    switch (stateIndex) {
      case 0:
        return "#6b7280";
      case 1:
        if (signalStrength >= 3) return "#4ade80";
        if (signalStrength === 2) return "#facc15";
        return "#f87171";
      case 2:
        return "#facc15";
      case 3:
        return "#4ade80";
      default:
        return "#fff";
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        {stateIndex === 2 ? (
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Icon name={getWifiIcon()} size={28} color={getWifiColor()} />
          </Animated.View>
        ) : stateIndex === 3 ? (
          <View>
            <Icon name={getWifiIcon()} size={28} color={getWifiColor()} />
            <Icon
              name="cellphone-wireless"
              size={14}
              color="#fff"
              style={styles.internetIcon}
            />
          </View>
        ) : (
          <Icon name={getWifiIcon()} size={28} color={getWifiColor()} />
        )}
      </TouchableOpacity>

      {}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Connection Status</Text>
            {stateIndex === 0 && <Text>Not connected</Text>}
            {stateIndex === 1 && (
              <Text>WiFi strength: {signalStrength}/4</Text>
            )}
            {stateIndex === 2 && <Text>Connecting...</Text>}
            {stateIndex === 3 && <Text>Connected to Internet</Text>}

            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  internetIcon: {
    position: "absolute",
    bottom: -2,
    right: -2,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 250,
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#2563eb",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default ConnectionStatus;
