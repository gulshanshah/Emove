import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Switch } from 'react-native-switch';
import { getSwitchesByRoomName, Switch as SwitchType } from '../functions/storage';
import io from 'socket.io-client';

const { width } = Dimensions.get('window');
const boxWidth = (width - 50) / 2;

interface Props {
  roomName: string | null;
}

const SERVER_URL = 'http://10.124.10.246:3000'; 


const socket = io(SERVER_URL, {
  transports: ['websocket'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const DeviceBox = ({ device, onToggle }: { device: SwitchType; onToggle: (id: string, value: boolean) => void }) => {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    
    socket.emit('joinHub', device.hub);

    
    const handleUpdate = (data: any) => {
      if (data[`relay${device.num}`] !== undefined) {
        setIsOn(data[`relay${device.num}`] === 0); 
      }
    };

    socket.on('stateUpdate', handleUpdate);
    return () => {
      socket.off('stateUpdate', handleUpdate);
    };
  }, [device.hub, device.num]);

  const toggleSwitch = (val: boolean) => {
    const actualVal = val ? 0 : 1; 
    setIsOn(val);
    socket.emit('toggleRelay', { hubId: device.hub, relayNum: device.num, value: actualVal });
    onToggle(device.id, val);
  };

  return (
    <View style={[styles.box, isOn && styles.boxOn]}>
      <Icon name={device.icon} size={60} color={isOn ? '#4e8cff' : '#A1A1A1'} />
      <Text style={styles.roomName}>{device.name}</Text>
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

const HomeActionBoxes = ({ roomName }: Props) => {
  const [switches, setSwitches] = useState<SwitchType[]>([]);

  useEffect(() => {
    const fetchSwitches = async () => {
      if (!roomName) return;
      const sw = await getSwitchesByRoomName(roomName);
      setSwitches(sw);
    };
    fetchSwitches();
  }, [roomName]);

  const handleToggle = (id: string, value: boolean) => {
    setSwitches(prev => prev.map(sw => (sw.id === id ? { ...sw, state: value } : sw)));
  };

  if (!roomName)
    return <Text style={{ color: '#fff', marginTop: 20 }}>Select a room to see switches</Text>;

  return (
    <FlatList
      data={switches}
      renderItem={({ item }) => <DeviceBox device={item} onToggle={handleToggle} />}
      keyExtractor={item => item.id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      contentContainerStyle={{ padding: 10 }}
    />
  );
};

const styles = StyleSheet.create({
  box: { width: boxWidth, backgroundColor: '#201a30ff', borderRadius: 15, padding: 20, alignItems: 'center', margin: 9 },
  boxOn: { backgroundColor: 'rgba(29, 76, 193, 0.15)' },
  roomName: { marginVertical: 10, fontSize: 17, fontWeight: '600', color: '#E3E3E3', textAlign: 'center' },
  bottomRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  switchWrapper: { marginVertical: 10 },
  power: { fontSize: 14, color: '#A1A1A1' },
});

export default HomeActionBoxes;
