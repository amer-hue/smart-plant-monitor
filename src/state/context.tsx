import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Plant, Reading } from '../types';

type User = {
  name: string;
  email: string;
};

type State = {
  plants: Plant[];
  isFahrenheit: boolean;
  user: User | null;
};

type Action =
  | { type: 'ADD_PLANT'; payload: Plant }
  | { type: 'UPDATE_PLANT'; payload: Plant }
  | { type: 'REMOVE_PLANT'; payload: string }
  | { type: 'TOGGLE_TEMP_UNIT' }
  | { type: 'SET_PLANTS'; payload: Plant[] }
  | { type: 'UPDATE_READING'; payload: { plantId: string; reading: Reading } }
  | { type: 'SET_USER'; payload: User };

const initialState: State = {
  plants: [],
  isFahrenheit: false,
  user: null,
};

const PLANTS_KEY = 'plants_v2';
const USER_KEY = 'user_v1';

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

    case 'SET_USER':
      return { ...state, user: action.payload };

    default:
      return state;
  }
};

const PlantContext = createContext<any>(null);

export const PlantProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(plantReducer, initialState);

  // Load AsyncStorage
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedPlants = await AsyncStorage.getItem(PLANTS_KEY);
        if (storedPlants) {
          dispatch({ type: 'SET_PLANTS', payload: JSON.parse(storedPlants) });
        }

        const storedUser = await AsyncStorage.getItem(USER_KEY);
        if (storedUser) {
          dispatch({ type: 'SET_USER', payload: JSON.parse(storedUser) });
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

  // Save user
  useEffect(() => {
    if (state.user) {
      AsyncStorage.setItem(USER_KEY, JSON.stringify(state.user));
    }
  }, [state.user]);

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
