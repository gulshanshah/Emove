import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const HomeActionStripes = ({ onTurnOnAll, onTurnOffAll }) => {
  const navigation = useNavigation();

  const handleSchedules = () => {
    navigation.navigate('Schedules');
  };

  return (
    <View style={styles.container}>
      {}
      <View style={styles.topStripe}>
        <TouchableOpacity onPress={onTurnOffAll} style={{ flex: 0.48 }}>
          <LinearGradient
            colors={['#282e56ff', '#06183fff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Icon name="power-off" size={22} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Turn Off All</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={onTurnOnAll} style={{ flex: 0.48 }}>
          <LinearGradient
            colors={['#282e56ff', '#06183fff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Icon name="power" size={22} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Turn On All</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {}
      <View style={styles.bottomStripe}>
        <TouchableOpacity style={{ width: '100%' }} onPress={handleSchedules}>
          <LinearGradient
            colors={['#282e56ff', '#06183fff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.scheduleButton}
          >
            <Icon name="calendar-clock" size={22} color="#fff" style={styles.icon} />
            <Text style={styles.scheduleText}>Schedules</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginRight: 10,
  },
  topStripe: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  bottomStripe: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  scheduleButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  scheduleText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default HomeActionStripes;
