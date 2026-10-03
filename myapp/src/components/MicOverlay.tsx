import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  StatusBar,
  View,
  Pressable,
  FlatList,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { height: windowHeight } = Dimensions.get("window");

type Message = { id: string; text: string; type: "user" | "ai" };

export default function MicOverlay({ onClose }: { onClose?: () => void }) {
  const topAnim = useRef(new Animated.Value(-windowHeight)).current;
  const heightAnim = useRef(new Animated.Value(windowHeight / 3)).current;

  const [messages, setMessages] = useState<Message[]>([]);
  const [listening, setListening] = useState(true);
  const [aiTyping, setAiTyping] = useState(false);

  const STATUSBAR_HEIGHT =
    Platform.OS === "android" ? StatusBar.currentHeight || 24 : 44;

  const addUserMessage = (text: string) => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setMessages(prev => {
        const newMessages = [...prev];
        const userMsgIndex = newMessages.findIndex(m => m.type === "user");
        if (userMsgIndex !== -1) {
          newMessages[userMsgIndex].text = text.slice(0, index);
        } else {
          newMessages.push({ id: Date.now().toString(), text: text.slice(0, index), type: "user" });
        }
        return newMessages;
      });
      if (index >= text.length) clearInterval(interval);
    }, 40);
  };

  const addAiMessage = (text: string) => {

    const workingId = Date.now().toString();
    setMessages(prev => [...prev, { id: workingId, text: "🤖 Working...", type: "ai" }]);
    setAiTyping(true);

    setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        index++;
        setMessages(prev => {
          const newMessages = [...prev];
          const aiMsgIndex = newMessages.findIndex(m => m.id === workingId);
          if (aiMsgIndex !== -1) {
            newMessages[aiMsgIndex].text = text.slice(0, index);
          }
          return newMessages;
        });
        if (index >= text.length) {
          clearInterval(interval);
          setAiTyping(false);
        }
      }, 40);
    }, 1500);
  };

  useEffect(() => {

    Animated.timing(topAnim, {
      toValue: 0,
      duration: 480,
      useNativeDriver: false,
    }).start(() => {
      setListening(true);

      setTimeout(() => {
        setListening(false);
        addUserMessage("Hello AI!");

        Animated.timing(heightAnim, {
          toValue: windowHeight / 2,
          duration: 380,
          useNativeDriver: false,
        }).start();

        setTimeout(() => {
          addAiMessage("Hello! I heard you clearly. How can I help you today?");
        }, 600);
      }, 2000);
    });
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: windowHeight / 3,
        duration: 180,
        useNativeDriver: false,
      }),
      Animated.timing(topAnim, {
        toValue: -windowHeight,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setMessages([]);
      setListening(true);
      onClose && onClose();
      topAnim.setValue(-windowHeight);
      heightAnim.setValue(windowHeight / 3);
    });
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.type === "user" ? styles.userBubble : styles.aiBubble,
      ]}
    >
      <Text style={item.type === "user" ? styles.userText : styles.aiText}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <>
      <StatusBar backgroundColor="#111827" barStyle="light-content" />
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <View style={styles.dimBackground} />
      </Pressable>

      <Animated.View
        style={[
          styles.topPanel,
          {
            transform: [{ translateY: topAnim }],
            height: heightAnim,
            paddingTop: STATUSBAR_HEIGHT + 10,
          },
        ]}
      >
        {listening && (
          <Text style={styles.listeningText}>🎤 Listening...</Text>
        )}

        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
          showsVerticalScrollIndicator={false}
        />

        {}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, zIndex: 50 },
  dimBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  topPanel: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "#111827",
    zIndex: 90,
    overflow: "hidden",
  },
  listeningText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 12,
    marginVertical: 6,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: "#4e8cff",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  aiBubble: {
    backgroundColor: "#333",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  userText: { color: "#fff", fontWeight: "600" },
  aiText: { color: "#fff" },
  innerClose: {
    position: "absolute",
    right: 14,
    top: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 6,
    borderRadius: 16,
  },
});
