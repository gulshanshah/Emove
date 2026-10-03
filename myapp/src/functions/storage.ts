
import AsyncStorage from "@react-native-async-storage/async-storage";



export interface Switch {
  id: string;
  num: number;
  name: string;
  hub: string;
  icon: string;
  power?: number; 
}

export interface Hub {
  id: string;
  name: string;
  icon: string;
  capacity: number;
  remains: string[]; 
}

export interface Room {
  name: string; 
  icon: string;
  switches: Switch[];
}



export const saveHub = async (hub: Hub): Promise<void> => {
  try {
    const hubsJSON = await AsyncStorage.getItem("hubs");
    const hubs: Hub[] = hubsJSON ? JSON.parse(hubsJSON) : [];

    const index = hubs.findIndex(h => h.id === hub.id);
    if (index >= 0) {
      hubs[index] = hub; 
      console.log(`Updated hub: ${hub.id}`);
    } else {
      hubs.push(hub); 
      console.log(`Added new hub: ${hub.id}`);
    }

    await AsyncStorage.setItem("hubs", JSON.stringify(hubs));
    console.log("Current hubs in storage:", hubs);
  } catch (err) {
    console.error("Error saving hub:", err);
  }
};

export const getHubs = async (): Promise<Hub[]> => {
  try {
    const hubsJSON = await AsyncStorage.getItem("hubs");
    const hubs: Hub[] = hubsJSON ? JSON.parse(hubsJSON) : [];
    console.log("Fetched hubs from storage:", hubs);
    return hubs;
  } catch (err) {
    console.error("Error getting hubs:", err);
    return [];
  }
};



export const saveRoom = async (room: Room): Promise<void> => {
  try {
    const roomsJSON = await AsyncStorage.getItem("rooms");
    const rooms: Room[] = roomsJSON ? JSON.parse(roomsJSON) : [];

    const index = rooms.findIndex(r => r.name === room.name);
    if (index >= 0) {
      rooms[index] = room; 
      console.log(`Updated room: ${room.name}`);
    } else {
      rooms.push(room); 
      console.log(`Added new room: ${room.name}`);
    }

    await AsyncStorage.setItem("rooms", JSON.stringify(rooms));
    console.log("Current rooms in storage:", rooms);
  } catch (err) {
    console.error("Error saving room:", err);
  }
};

export const getRooms = async (): Promise<Room[]> => {
  try {
    const roomsJSON = await AsyncStorage.getItem("rooms");
    const rooms: Room[] = roomsJSON ? JSON.parse(roomsJSON) : [];
    console.log("Fetched rooms from storage:", rooms);
    return rooms;
  } catch (err) {
    console.error("Error getting rooms:", err);
    return [];
  }
};



export const addSwitchToRoom = async (
  roomName: string,
  hubId: string,
  slot: string,
  newSwitch: Switch
): Promise<void> => {
  try {
    
    const hubs = await getHubs();
    const hubIndex = hubs.findIndex(h => h.id === hubId);
    if (hubIndex >= 0) {
      hubs[hubIndex].remains = hubs[hubIndex].remains.filter(r => r !== slot);
      await AsyncStorage.setItem("hubs", JSON.stringify(hubs));
      console.log(`Updated hub ${hubId}, removed slot ${slot}`);
    }

    
    const rooms = await getRooms();
    const roomIndex = rooms.findIndex(r => r.name === roomName);

    if (roomIndex >= 0) {
      const swIndex = rooms[roomIndex].switches.findIndex(s => s.id === newSwitch.id);
      if (swIndex >= 0) {
        rooms[roomIndex].switches[swIndex] = newSwitch; 
        console.log(`Updated switch ${newSwitch.id} in room ${roomName}`);
      } else {
        rooms[roomIndex].switches.push(newSwitch); 
        console.log(`Added switch ${newSwitch.id} to room ${roomName}`);
      }
    } else {
      rooms.push({
        name: roomName,
        icon: "home", 
        switches: [newSwitch],
      });
      console.log(`Created new room ${roomName} and added switch ${newSwitch.id}`);
    }

    await AsyncStorage.setItem("rooms", JSON.stringify(rooms));
  } catch (err) {
    console.error("Error adding switch to room:", err);
  }
};

export const deleteSwitchFromRoom = async (
  roomName: string,
  hubId: string,
  slot: string,
  switchId: string
): Promise<void> => {
  try {
    
    const rooms = await getRooms();
    const roomIndex = rooms.findIndex(r => r.name === roomName);

    if (roomIndex >= 0) {
      rooms[roomIndex].switches = rooms[roomIndex].switches.filter(s => s.id !== switchId);
      console.log(`Removed switch ${switchId} from room ${roomName}`);
      await AsyncStorage.setItem("rooms", JSON.stringify(rooms));
    }

    
    const hubs = await getHubs();
    const hubIndex = hubs.findIndex(h => h.id === hubId);
    if (hubIndex >= 0) {
      hubs[hubIndex].remains.push(slot);
      hubs[hubIndex].remains.sort(); 
      console.log(`Restored slot ${slot} back to hub ${hubId}`);
      await AsyncStorage.setItem("hubs", JSON.stringify(hubs));
    }
  } catch (err) {
    console.error("Error deleting switch:", err);
  }
};



export const getHubById = async (id: string): Promise<Hub | undefined> => {
  const hubs = await getHubs();
  return hubs.find(h => h.id === id);
};

export const getRoomByName = async (name: string): Promise<Room | undefined> => {
  const rooms = await getRooms();
  return rooms.find(r => r.name === name);
};

export const getSwitchesByRoomName = async (roomName: string): Promise<Switch[]> => {
  try {
    const rooms = await getRooms();
    const room = rooms.find(r => r.name === roomName);
    return room ? room.switches : [];
  } catch (err) {
    console.error("Error getting switches by room name:", err);
    return [];
  }
};


export const getSwitchesByHubId = async (hubId: string): Promise<{ roomName: string; switches: Switch[] }[]> => {
  try {
    const rooms = await getRooms();
    
    const result = rooms
      .map(room => {
        const hubSwitches = room.switches.filter(sw => sw.hub === hubId);
        if (hubSwitches.length > 0) {
          return { roomName: room.name, switches: hubSwitches };
        }
        return null;
      })
      .filter(Boolean) as { roomName: string; switches: Switch[] }[];

    return result;
  } catch (err) {
    console.error("Error getting switches by hubId:", err);
    return [];
  }
};
