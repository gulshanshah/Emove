import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Switch } from 'react-native-switch';
import io from 'socket.io-client';

import AddSwitchModal from './AddSwitchModal';
import { getSwitchesByRoomName } from '../functions/storage';

const { width } = Dimensions.get('window');
const boxWidth = (width - 50) / 2;


const socket = io('http://10.124.10.246:3000'); 


const DeviceBox = ({ device, openBottomSheet }) => {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    
    socket.emit('joinHub', device.hub);

    
    const handleStateUpdate = (data) => {
      if (data[`relay${device.num}`] !== undefined) {
        
        setIsOn(data[`relay${device.num}`] === 0); 
      }
    };

    socket.on('stateUpdate', handleStateUpdate);
    return () => socket.off('stateUpdate', handleStateUpdate);
  }, [device.hub, device.num]);

  const toggleSwitch = (val) => {
    
    const actualVal = val ? 0 : 1;
    setIsOn(val);
    socket.emit('toggleRelay', { hubId: device.hub, relayNum: device.num, value: actualVal });
  };

  return (
    <View style={[styles.box, isOn && styles.boxOn]}>
      <TouchableOpacity style={styles.menuIcon} onPress={() => openBottomSheet(device)}>
        <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
      </TouchableOpacity>

      <Icon name={device.icon} size={60} color={isOn ? '#4e8cff' : '#A1A1A1'} />
      <Text style={styles.deviceName}>{device.name}</Text>

      <View style={styles.switchWrapper}>
        <Switch
                  value={isOn}
                  onValueChange={toggleSwitch}
                  disabled={false}
                  activeText={''}
                  inActiveText={''}
                  circleSize={28}
                  barHeight={32}
                  circleBorderWidth={0}
                  backgroundActive="#4e8cff"
                  backgroundInactive="#ddd"
                  circleActiveColor="#fff"
                  circleInActiveColor="#fff"
                  changeValueImmediately={true}
                  innerCircleStyle={{ alignItems: 'center', justifyContent: 'center' }}
                  renderInsideCircle={() => null}
                  switchLeftPx={3.5}
                  switchRightPx={3.5}
                  switchWidthMultiplier={2}
                  switchBorderRadius={16}
                  animationDuration={100}
                />
        
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.power}>{device.power ? `${device.power}W` : '—'}</Text>
      </View>
    </View>
  );
};


const RoomsInside = ({ navigation, route }) => {
  const [switches, setSwitches] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const roomName = route?.params?.room?.name;

  useEffect(() => {
    const fetchSwitches = async () => {
      if (!roomName) return;
      const sw = await getSwitchesByRoomName(roomName);
      setSwitches(sw);
    };
    fetchSwitches();
  }, [roomName, modalVisible]);

  const openBottomSheet = (device) => {
    setSelectedDevice(device);
    setBottomSheetVisible(true);
  };

  const handleOption = (option) => {
    console.log(option, selectedDevice?.name);
    setBottomSheetVisible(false);
  };

  const handleAddSwitch = (switchData) => {
    console.log('Switch Added:', switchData);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.roomTitle}>{roomName || 'Room'}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {}
      {switches.length ? (
        <FlatList
          data={switches}
          renderItem={({ item }) => <DeviceBox device={item} openBottomSheet={openBottomSheet} />}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ padding: 10 }}
        />
      ) : (
        <Text style={{ color: '#aaa', textAlign: 'center', marginTop: 30 }}>
          No switches in this room yet
        </Text>
      )}

      {}
      <Modal
        visible={bottomSheetVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBottomSheetVisible(false)}
      >
        <TouchableOpacity
          style={styles.bottomOverlay}
          activeOpacity={1}
          onPress={() => setBottomSheetVisible(false)}
        />
        <View style={styles.bottomSheet}>
          <Text style={styles.sheetHeader}>{selectedDevice?.name}</Text>

          <TouchableOpacity style={styles.sheetOption} onPress={() => handleOption('Edit')}>
            <Ionicons name="pencil-outline" size={20} color="#4e8cff" style={{ marginRight: 10 }} />
            <Text style={styles.sheetOptionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sheetOption} onPress={() => handleOption('Delete')}>
            <Ionicons name="trash-outline" size={20} color="#ff4d4d" style={{ marginRight: 10 }} />
            <Text style={[styles.sheetOptionText, { color: '#ff4d4d' }]}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sheetOption} onPress={() => handleOption('Cancel')}>
            <Ionicons name="close-outline" size={20} color="#777" style={{ marginRight: 10 }} />
            <Text style={[styles.sheetOptionText, { color: '#777' }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <AddSwitchModal
          visible={true}
          onClose={() => setModalVisible(false)}
          onAdd={handleAddSwitch}
          roomName={roomName}
        />
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  roomTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  box: {
    width: boxWidth,
    backgroundColor: '#201a30ff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    margin: 9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  boxOn: { backgroundColor: 'rgba(29, 76, 193, 0.15)' },
  menuIcon: { position: 'absolute', top: 10, right: 10, zIndex: 10 },
  deviceName: { marginVertical: 10, fontSize: 17, fontWeight: '600', color: '#E3E3E3', textAlign: 'center' },
  bottomRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  switchWrapper: { marginVertical: 10 },
  power: { fontSize: 14, color: '#A1A1A1' },
  bottomOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#1f2937',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
  },
  sheetHeader: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 15 },
  sheetOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  sheetOptionText: { fontSize: 16, fontWeight: '600', color: '#4e8cff' },
});

export default RoomsInside;
