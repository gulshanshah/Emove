import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { io, Socket } from "socket.io-client";

const SERVER_URL = "http://10.124.10.246:3000";

const HomeHead = () => {
  const [connectionModalVisible, setConnectionModalVisible] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to server via Socket.IO");
      setIsConnected(true);
      setConnectionStatus("Connected");
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      setIsConnected(false);
      setConnectionStatus("Disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.log("❌ Connection error:", error);
      setIsConnected(false);
      setConnectionStatus("Connection Failed");
    });

    newSocket.on("stateUpdate", (data) => {
      console.log("📩 Received state update:", data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const reconnect = () => {
    if (socket) {
      socket.connect();
    }
  };

  return (
    <>
      {}
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setConnectionModalVisible(true)}>
          <Icon
            name={isConnected ? "wifi" : "wifi-off"}
            size={28}
            color={isConnected ? "#4ade80" : "#6b7280"}
          />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isConnected ? "Smart Home" : "Disconnected"}
        </Text>
        <View style={styles.iconsContainer}>
          <Icon name="bell-outline" size={28} color="#fff" />
          <Icon name="calendar-outline" size={28} color="#fff" style={{ marginLeft: 17 }} />
        </View>
      </View>

      {}
      <Modal
        transparent
        visible={connectionModalVisible}
        animationType="slide"
        onRequestClose={() => setConnectionModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setConnectionModalVisible(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            {}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Connection Status</Text>
              <TouchableOpacity
                onPress={() => setConnectionModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {}
            <View style={styles.statusContainer}>
              <Icon
                name={isConnected ? "wifi" : "wifi-off"}
                size={48}
                color={isConnected ? "#4ade80" : "#6b7280"}
              />
              <Text style={styles.statusText}>{connectionStatus}</Text>
              <Text style={styles.serverText}>Server: {SERVER_URL}</Text>

              {!isConnected && (
                <TouchableOpacity style={styles.reconnectButton} onPress={reconnect}>
                  <Text style={styles.reconnectText}>Reconnect</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    height: 70,
    backgroundColor: "#111827",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  iconsContainer: {
    flexDirection: "row",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#1f2937",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "40%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    padding: 4,
  },
  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  serverText: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 5,
  },
  reconnectButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  reconnectText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default HomeHead;
