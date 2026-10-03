import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

export default function EnergyScreen() {
  const [timeRange, setTimeRange] = useState("Day");
  const [selectedBar, setSelectedBar] = useState<number | null>(null);
  const scrollViewRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  
  const totalDayUsage = "120 kWh";
  const totalWeekUsage = "750 kWh";
  const totalMonthUsage = "3100 kWh";

  const devices = [
    { name: "Air Conditioner", value: 45, duration: "3h 0m", room: "Living Room" },
    { name: "Fridge", value: 30, duration: "24h", room: "Kitchen" },
    { name: "Washer", value: 20, duration: "1h 30m", room: "Laundry" },
    { name: "TV", value: 25, duration: "2h 0m", room: "Bedroom" },
  ];

  const weekData = [100, 120, 90, 140, 160, 110, 130]; 
  const maxDeviceValue = Math.max(...devices.map((d) => d.value));
  const maxWeekValue = Math.max(...weekData);

  
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / width);
    const ranges = ["Day", "Week", "Month"];
    setTimeRange(ranges[page]);
  };

  
  const scrollToPage = (page) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: page * width, animated: true });
    }
  };

  const renderDevices = () => (
    <>
      <Text style={styles.sectionTitle}>By Devices</Text>
      {devices.map((d, idx) => {
        const widthPercent = (d.value / maxDeviceValue) * 100;
        return (
          <View key={idx} style={styles.deviceCard}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text style={styles.roomName}>{d.room}</Text>
                <Text style={styles.deviceName}>{d.name}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.deviceValue}>{d.value} kWh</Text>
                <Text style={styles.deviceTime}>{d.duration}</Text>
              </View>
            </View>

            <View style={styles.pollWrapper}>
              <View style={[styles.pollBar, { width: `${widthPercent}%` }]} />
            </View>
          </View>
        );
      })}
    </>
  );

  const renderDayView = () => (
    <View style={[styles.page, { width }]}>
      <Text style={styles.sectionTitle}>Today's Usage</Text>
      <View style={styles.totalWrapper}>
        <Text style={styles.totalText}>{totalDayUsage}</Text>
      </View>
      {renderDevices()}
    </View>
  );

  const renderWeekView = () => (
    <View style={[styles.page, { width }]}>
      <Text style={styles.sectionTitle}>This Week's Usage</Text>
      <View style={styles.totalWrapper}>
        <Text style={styles.totalText}>{totalWeekUsage}</Text>
      </View>

      <View style={styles.barChartContainer}>
        {weekData.map((val, idx) => {
          const heightPercent = (val / maxWeekValue) * 100;
          const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const isSelected = selectedBar === idx;

          return (
            <TouchableOpacity
              key={idx}
              style={styles.barWrapper}
              onPress={() => setSelectedBar(isSelected ? null : idx)}
            >
              {isSelected && <Text style={styles.barValue}>{val} kWh</Text>}
              <View style={[styles.bar, { height: `${heightPercent}%` }]} />
              <Text style={styles.barLabel}>{dayNames[idx]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {renderDevices()}
    </View>
  );

  const renderMonthView = () => (
    <View style={[styles.page, { width }]}>
      <Text style={styles.sectionTitle}>This Month's Usage</Text>
      <View style={styles.totalWrapper}>
        <Text style={styles.totalText}>{totalMonthUsage}</Text>
      </View>

      <TouchableOpacity style={styles.prevBtn}>
        <Icon name="calendar" size={18} color="#fff" />
        <Text style={styles.prevBtnText}>Previous Months</Text>
      </TouchableOpacity>

      {renderDevices()}
    </View>
  );

  
  const indicatorPosition = scrollX.interpolate({
    inputRange: [0, width, width * 2],
    outputRange: [0, width / 3, (width / 3) * 2],
  });

  return (
    <View style={styles.container}>
      {}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Energy Usage</Text>
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={() => console.log("Global Refresh")}
        >
          <Icon name="refresh" size={18} color="#fff" />
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {}
      <View style={styles.toggleContainer}>
        {["Day", "Week", "Month"].map((range, index) => (
          <TouchableOpacity
            key={range}
            onPress={() => {
              setTimeRange(range);
              scrollToPage(index);
            }}
            style={[
              styles.toggleButton,
              timeRange === range && styles.toggleButtonActive,
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                timeRange === range && styles.toggleTextActive,
              ]}
            >
              {range}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {}
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        style={styles.horizontalScrollView}
      >
        {renderDayView()}
        {renderWeekView()}
        {renderMonthView()}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#111827" 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: { 
    color: "#fff", 
    fontSize: 22, 
    fontWeight: "700" 
  },
  refreshBtn: { 
    flexDirection: "row", 
    alignItems: "center",
    backgroundColor: "#4e8cff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  refreshText: { 
    color: "#fff", 
    marginLeft: 4, 
    fontSize: 13 
  },
  toggleContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#1f2937",
    borderRadius: 12,
    height: 44,
    overflow: "hidden",
  },
  toggleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  toggleButtonActive: {
    backgroundColor: "#4e8cff",
  },
  toggleText: { 
    color: "#A1A1A1", 
    fontWeight: "600",
    fontSize: 15,
  },
  toggleTextActive: {
    color: "#fff",
  },
  horizontalScrollView: {
    flex: 1,
  },
  page: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "700", 
    marginTop: 15, 
    marginBottom: 8 
  },
  totalWrapper: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  totalText: { 
    color: "#4e8cff", 
    fontWeight: "700", 
    fontSize: 20 
  },
  deviceCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  roomName: { 
    color: "#A1A1A1", 
    fontSize: 13, 
    marginBottom: 2 
  },
  deviceName: { 
    color: "#fff", 
    fontWeight: "600", 
    fontSize: 16 
  },
  deviceValue: { 
    color: "#4e8cff", 
    fontWeight: "700", 
    fontSize: 15 
  },
  deviceTime: { 
    color: "#A1A1A1", 
    fontSize: 12, 
    marginTop: 2 
  },
  pollWrapper: {
    height: 14,
    backgroundColor: "#374151",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 8,
  },
  pollBar: { 
    height: "100%", 
    borderRadius: 8,
    backgroundColor: "#4e8cff" 
  },
  barChartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 180,
    marginBottom: 20,
  },
  barWrapper: { 
    alignItems: "center", 
    flex: 1, 
    marginHorizontal: 4 
  },
  bar: { 
    width: 24, 
    backgroundColor: "#4e8cff", 
    borderRadius: 6 
  },
  barLabel: { 
    color: "#fff", 
    marginTop: 5, 
    fontSize: 12 
  },
  barValue: { 
    color: "#fff", 
    fontSize: 12, 
    marginBottom: 4 
  },
  prevBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4e8cff",
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  prevBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 6,
  },
});