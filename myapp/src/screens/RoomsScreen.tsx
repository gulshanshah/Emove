import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";

import RoomsBoxes from "../blocks/RoomsBoxes";
import RoomsHubs from "../blocks/RoomsHubs";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function RoomsScreen() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tabContainerWidth, setTabContainerWidth] = useState(SCREEN_WIDTH - 40);

  const tabWidth = tabContainerWidth / 2;

  const translateX = scrollX.interpolate({
    inputRange: [0, SCREEN_WIDTH],
    outputRange: [0, tabWidth],
    extrapolate: "clamp",
  });

  const handleTabPress = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    }
    setActiveIndex(index);
  };

  const onMomentumScrollEnd = (e) => {
    const x = e.nativeEvent.contentOffset.x || 0;
    const newIndex = Math.round(x / SCREEN_WIDTH);
    setActiveIndex(newIndex);
  };

  return (
    <View style={styles.container}>

      {}
      <View style={styles.tabOuter}>
        <View
          style={styles.tabContainer}
          onLayout={(e) => {
            const w = e.nativeEvent.layout.width;
            if (w && Math.abs(w - tabContainerWidth) > 0.5) setTabContainerWidth(w);
          }}
        >
          {}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pill,
              {
                width: Math.max(tabWidth - 12, 80),
                transform: [{ translateX }],
              },
            ]}
          />

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.tabBtn}
            onPress={() => handleTabPress(0)}
          >
            <Text style={[styles.tabText, activeIndex === 0 && styles.tabTextActive]}>
              Rooms
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.tabBtn}
            onPress={() => handleTabPress(1)}
          >
            <Text style={[styles.tabText, activeIndex === 1 && styles.tabTextActive]}>
              Hubs
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
      >
        <View style={{ width: SCREEN_WIDTH }}>
          <RoomsBoxes />
        </View>

        <View style={{ width: SCREEN_WIDTH }}>
          {}
          <RoomsHubs isActive={activeIndex === 1} />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1724",
  },

  tabOuter: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#111827",
    borderRadius: 14,
    paddingVertical: 10,
    position: "relative",
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },

  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    paddingVertical: 8,
  },

  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#9aa4b2",
    letterSpacing: 0.2,
  },

  tabTextActive: {
    color: "#fff",
  },

  pill: {
    position: "absolute",
    left: 6,
    top: 6,
    bottom: 6,
    borderRadius: 12,
    backgroundColor: "#1948ff",
    opacity: 0.98,

    shadowColor: "#1948ff",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
});
