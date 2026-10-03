import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const initialSchedules = [
  { id: '1', room: 'Living Room', device: 'Lights', time: '07:00 AM' },
  { id: '2', room: 'Bedroom', device: 'AC', time: '08:30 AM' },
  { id: '3', room: 'Kitchen', device: 'Fan', time: '06:00 PM' },
  { id: '4', room: 'Garage', device: 'Door', time: '09:00 PM' },
];

const SchedulesScreen = () => {
  const navigation = useNavigation();
  const [schedules, setSchedules] = useState(initialSchedules);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<
    typeof initialSchedules[0] | null
  >(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRemove = () => {
    if (selectedSchedule) {
      setSchedules(prev =>
        prev.filter(s => s.id !== selectedSchedule.id)
      );
      setSelectedSchedule(null);
      setModalVisible(false);
    }
  };

  const renderItem = ({ item }: { item: typeof initialSchedules[0] }) => (
    <Animated.View
      style={[
        styles.scheduleItem,
        { opacity: fadeAnim, transform: [{ translateY }] },
      ]}
    >
      <View>
        <Text style={styles.roomName}>{item.room}</Text>
        <Text style={styles.deviceName}>{item.device}</Text>
        <Text style={styles.scheduleTime}>{item.time}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          setSelectedSchedule(item);
          setModalVisible(true);
        }}
      >
        <Icon name="delete-outline" size={24} color="#ff4d4d" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedules</Text>
        <TouchableOpacity onPress={() => console.log('More options')}>
          <Icon name="dots-vertical" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {}
      <FlatList
        data={schedules}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 15 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      {}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Remove Schedule</Text>
            {selectedSchedule && (
              <Text style={styles.modalMessage}>
                Are you sure you want to remove{" "}
                <Text style={{ fontWeight: "700" }}>
                  {selectedSchedule.room} - {selectedSchedule.device}
                </Text>
                ?
              </Text>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#333' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ff4d4d' }]}
                onPress={handleRemove}
              >
                <Text style={styles.modalButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#201a30',
    padding: 15,
    borderRadius: 12,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a0a0a0',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginTop: 2,
  },
  scheduleTime: {
    fontSize: 14,
    color: '#a0a0a0',
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default SchedulesScreen;
