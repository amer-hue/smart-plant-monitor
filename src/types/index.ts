import { Plant } from './plantTypes';

export type Reading = {
moisture: number;
tempC: number;
light: number;
ts: number;
};

export type Plant = {
id: string;
name: string;
deviceId?: string;
last?: Reading;
};

export type Plant = {
  id: string;
  name: string;
  type?: string;
  location?: string;
  deviceId?: string;
  last?: {
    temperature?: number;
    moisture?: number;
    humidity?: number;
    light?: number;
  };
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  MainTabs: undefined;
  Dashboard: undefined;
  Scan: undefined;
  PlantDetail: { plantId: string };
  AddPlant: undefined;
  MyPlants: undefined;
  Statistics: { plant: Plant }; 
  Settings: undefined;
};

