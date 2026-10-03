import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './components/BottomTabNavigator';

interface Switch {
  id: string;
  num: number;
  name: string;
  hub: string;
  icon: string;
  power: number;
}

interface Room {
  name: string;
  icon: string;
  switches: Switch[];
}

const initialRooms: Room[] = [
  {
    name: "Living Room",
    icon: "sofa",
    switches: [
      { id: "sw1", name: "Light", hub: "hub0801", num: 1, icon: "lightbulb-on", power: 0 },
      { id: "sw2", name: "TV", hub: "hub0801", num: 2, icon: "television", power: 0 },
      { id: "sw3", name: "Fan", hub: "hub0801", num: 3, icon: "fan", power: 0 },
      { id: "sw4", name: "Cooler", hub: "hub0801", num: 4, icon: "air-conditioner", power: 0 },
    ],
  },
  {
    name: "Kitchen",
    icon: "shield-home",
    switches: [
      { id: "sw5", name: "Light", hub: "hub0801", num: 5, icon: "lightbulb-on", power: 0 },
      { id: "sw6", name: "Exhaust", hub: "hub0801", num: 6, icon: "fan", power: 0 },
      { id: "sw7", name: "Fridge", hub: "hub0801", num: 7, icon: "fridge", power: 0 },
      { id: "sw8", name: "Light 2", hub: "hub0801", num: 8, icon: "lightbulb-on", power: 0 },
    ],
  },
];

const initData = async () => {
  try {
    const roomsJSON = await AsyncStorage.getItem("rooms");

    if (!roomsJSON) {
      console.log("🚀 First run → inserting initial data...");
      await AsyncStorage.setItem("rooms", JSON.stringify(initialRooms));
    } else {
      console.log("✅ Rooms already exist, skipping init");
    }
  } catch (err) {
    console.error("❌ Error initializing data:", err);
  }
};

const Stack = createNativeStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      await initData();
      setLoading(false);
    };
    bootstrap();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomeTabs" component={BottomTabNavigator} />
          {}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
