import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { height: windowHeight } = Dimensions.get("window");

interface OptionModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function OptionModal({ visible, onClose, title, children }: OptionModalProps) {
  const slideAnim = useRef(new Animated.Value(windowHeight)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: windowHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View />
      </TouchableOpacity>
      <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    maxHeight: "80%",
    backgroundColor: "#1f2937",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: { fontSize: 18, fontWeight: "700", color: "#fff" },
  content: { padding: 16 },
});
