import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import * as Crypto from 'expo-crypto';

import { usePlantStore } from '../state/context';
import { Plant, RootStackParamList } from '../types';

type NavProp = StackNavigationProp<RootStackParamList, 'AddPlant'>;

export default function AddPlantScreen() {
  const navigation = useNavigation<NavProp>();
  const { addPlant } = usePlantStore();

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a plant name.');
      return;
    }

    const newPlant: Plant = {
      id: Crypto.randomUUID(),
      name,
      type: type.trim() || undefined,
      location: location.trim() || undefined,
      last: undefined,
    };

    addPlant(newPlant);

    navigation.navigate('MainTabs', {
      screen: 'MyPlants',
  });  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Plant</Text>

      <TextInput
        style={styles.input}
        placeholder="Plant Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Plant Type (optional)"
        placeholderTextColor="#888"
        value={type}
        onChangeText={setType}
      />

      <TextInput
        style={styles.input}
        placeholder="Location (optional)"
        placeholderTextColor="#888"
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Plant</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 10,
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
