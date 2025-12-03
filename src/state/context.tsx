//import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useReducer } from 'react';
import { PlantType } from '../types';

type State = {
  plants: PlantType[];
  isFahrenheit: boolean;
};

type Action =
  | { type: 'REMOVE_PLANT'; payload: string }
  | { type: 'TOGGLE_TEMP_UNIT' }
  | { type: 'SET_PLANTS'; payload: PlantType[] }

const initialState: State = {
  plants: [],
  isFahrenheit: false,
};


const plantReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TOGGLE_TEMP_UNIT':
      return { ...state, isFahrenheit: !state.isFahrenheit };

    case 'SET_PLANTS':
      return { ...state, plants: action.payload };
    default:
      return state;
  }
};

const PlantContext = createContext<any>(null);

export const PlantProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(plantReducer, initialState);

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
