import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getRooms, Room } from '../functions/storage';

interface Props {
  onRoomSelect?: (roomName: string) => void;
}

const HomeHorizontalStripe = ({ onRoomSelect }: Props) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      const storedRooms = await getRooms();
      setRooms(storedRooms);
      if (storedRooms.length > 0) {
        setSelectedRoom(storedRooms[0].name);
        onRoomSelect?.(storedRooms[0].name);
      }
    };
    fetchRooms();
  }, []);

  const handleSelect = (name: string) => {
    setSelectedRoom(name);
    onRoomSelect?.(name);
  };

  const renderItem = ({ item }: { item: Room }) => {
    const isSelected = item.name === selectedRoom;
    return (
      <TouchableOpacity onPress={() => handleSelect(item.name)} activeOpacity={0.8}>
        <View style={[styles.itemContainer, isSelected && styles.selectedItem]}>
          <Text style={[styles.itemText, isSelected && styles.selectedText]}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={['#2C253B', '#201a30ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradientContainer}
    >
      <FlatList
        horizontal
        data={rooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: { paddingVertical: 5, borderRadius: 15, marginHorizontal: 10, height: 54, marginLeft: 10 },
  itemContainer: { paddingHorizontal: 20, paddingVertical: 10, marginHorizontal: 5 },
  selectedItem: { shadowColor: '#00f', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 10 },
  itemText: { color: '#41767D', fontWeight: '600', fontSize: 17 },
  selectedText: { color: '#fff', fontWeight: '700', fontSize: 18 },
});

export default HomeHorizontalStripe;
