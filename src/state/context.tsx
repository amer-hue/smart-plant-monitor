import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { PlantType, Reading } from '../types';

type State = {
  plants: PlantType[];
  isFahrenheit: boolean;
};

type Action =
  | { type: 'ADD_PLANT'; payload: PlantType }
  | { type: 'UPDATE_PLANT'; payload: PlantType }
  | { type: 'REMOVE_PLANT'; payload: string }
  | { type: 'TOGGLE_TEMP_UNIT' }
  | { type: 'SET_PLANTS'; payload: PlantType[] }
  | { type: 'UPDATE_READING'; payload: { plantId: string; reading: Reading } };

const initialState: State = {
  plants: [],
  isFahrenheit: false,
};

const PLANTS_KEY = 'plants_v2';

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

const PlantContext = createContext<any>(null);

export const PlantProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(plantReducer, initialState);

  // Load plants from AsyncStorage (you can later move these to Firestore)
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedPlants = await AsyncStorage.getItem(PLANTS_KEY);
        if (storedPlants) {
          dispatch({ type: 'SET_PLANTS', payload: JSON.parse(storedPlants) });
        }
      } catch (e) {
        console.error('Failed to load storage', e);
      }
    };
    loadState();
  }, []);

  // Save plants
  useEffect(() => {
    AsyncStorage.setItem(PLANTS_KEY, JSON.stringify(state.plants));
  }, [state.plants]);

  return (
    <PlantContext.Provider value={{ state, dispatch }}>
      {children}
    </PlantContext.Provider>
  );
};

export const usePlantStore = () => {
  const ctx = useContext(PlantContext);
  if (!ctx) throw new Error('usePlantStore must be inside provider');
  return ctx;
};
