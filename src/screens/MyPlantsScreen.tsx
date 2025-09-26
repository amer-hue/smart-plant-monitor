import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { usePlantStore } from '../state/context';

type NavProp = StackNavigationProp<RootStackParamList, 'Statistics'>;

export default function MyPlantsScreen() {
  const navigation = useNavigation<NavProp>();
  const { state } = usePlantStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Plants</Text>

      <FlatList
        data={state.plants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.plantCard}
            onPress={() => navigation.navigate('Statistics', { plant: item })}
          >
            <Text style={styles.plantName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPlant')}
      >
        <Text style={styles.addButtonText}>Add New Plant</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 20, textAlign: 'center' },
  plantCard: { backgroundColor: '#1E1E1E', padding: 15, borderRadius: 10, marginBottom: 15 },
  plantName: { color: '#fff', fontSize: 16 },
  addButton: { backgroundColor: '#4CAF50', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
