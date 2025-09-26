import React, { createContext, useReducer, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plant, Reading } from '../types';
import { BLEClient } from '../ble/client';

type State = {
  plants: Plant[];
  isFahrenheit: boolean;
};

type Action =
  | { type: 'ADD_PLANT'; payload: Plant }
  | { type: 'UPDATE_PLANT'; payload: Plant }
  | { type: 'REMOVE_PLANT'; payload: string }
  | { type: 'TOGGLE_TEMP_UNIT' }
  | { type: 'SET_PLANTS'; payload: Plant[] }
  | { type: 'UPDATE_READING'; payload: { plantId: string; reading: Reading } };

const initialState: State = {
  plants: [],
  isFahrenheit: false,
};

const PlantContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  refreshReading: (plantId: string) => void;
  unpairDevice: (plantId: string) => void;
  pairDevice: (plantId: string, deviceId: string) => void;
  addPlant: (plant: Plant) => void; // ✅ NEW
}>({
  state: initialState,
  dispatch: () => null,
  refreshReading: () => null,
  unpairDevice: () => null,
  pairDevice: () => null,
  addPlant: () => null, // ✅ NEW
});

const plantReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_PLANT':
      return { ...state, plants: [...state.plants, action.payload] };
    case 'UPDATE_PLANT':
      return {
        ...state,
        plants: state.plants.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'REMOVE_PLANT':
      return {
        ...state,
        plants: state.plants.filter(p => p.id !== action.payload),
      };
    case 'TOGGLE_TEMP_UNIT':
      return { ...state, isFahrenheit: !state.isFahrenheit };
    case 'SET_PLANTS':
      return { ...state, plants: action.payload };
    case 'UPDATE_READING':
      return {
        ...state,
        plants: state.plants.map(p =>
          p.id === action.payload.plantId
            ? { ...p, last: action.payload.reading }
            : p
        ),
      };
    default:
      return state;
  }
};

export const PlantProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(plantReducer, initialState);

  // Load state from AsyncStorage on startup
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedPlants = await AsyncStorage.getItem('plants');
        if (storedPlants) {
          dispatch({ type: 'SET_PLANTS', payload: JSON.parse(storedPlants) });
        }
      } catch (e) {
        console.error('Failed to load plants from storage', e);
      }
    };
    loadState();
  }, []);

  // Save state to AsyncStorage whenever plants change
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem('plants', JSON.stringify(state.plants));
      } catch (e) {
        console.error('Failed to save plants to storage', e);
      }
    };
    saveState();
  }, [state.plants]);

  // Action helpers
  const refreshReading = async (plantId: string) => {
    const plant = state.plants.find(p => p.id === plantId);
    if (!plant || !plant.deviceId) return;
    try {
      const reading = await BLEClient.readLatest(plant.deviceId);
      dispatch({ type: 'UPDATE_READING', payload: { plantId, reading } });
    } catch (e) {
      console.error('Failed to refresh reading', e);
    }
  };

  const unpairDevice = (plantId: string) => {
    const plant = state.plants.find(p => p.id === plantId);
    if (!plant || !plant.deviceId) return;
    BLEClient.disconnect(plant.deviceId);
    dispatch({
      type: 'UPDATE_PLANT',
      payload: { ...plant, deviceId: undefined },
    });
  };

  const pairDevice = (plantId: string, deviceId: string) => {
    const plant = state.plants.find(p => p.id === plantId);
    if (!plant) return;
    BLEClient.connect(deviceId);
    dispatch({
      type: 'UPDATE_PLANT',
      payload: { ...plant, deviceId },
    });
  };

  // ✅ NEW: Add plant
  const addPlant = (plant: Plant) => {
    dispatch({ type: 'ADD_PLANT', payload: plant });
  };

  return (
    <PlantContext.Provider
      value={{
        state,
        dispatch,
        refreshReading,
        unpairDevice,
        pairDevice,
        addPlant, // ✅ make available
      }}
    >
      {children}
    </PlantContext.Provider>
  );
};

export const usePlantStore = () => {
  const context = useContext(PlantContext);
  if (context === undefined) {
    throw new Error('usePlantStore must be used within a PlantProvider');
  }
  return context;
};
