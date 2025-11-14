export type Reading = {
  moisture: number;
  tempC: number;
  light: number;
  ts: number;
};

export type Plant = {
  id: string;
  name: string;
  type?: string;
  location?: string;
  deviceId?: string;
  imageUri?: string;   
  last?: {
    tempC?: number;
    moisture?: number;
    light?: number;
  };
};


export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;

  MainTabs: undefined;

  Dashboard: undefined;
  MyPlants: undefined;
  Scan: undefined;
  Settings: undefined;

  AddPlant: undefined;
  PlantDetail: { plantId: string };
  Statistics: { plantId: string };
};


