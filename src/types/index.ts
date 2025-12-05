export type Reading = {
  soilMoisture: number;
  tempC: number;
  light: number;
  humidity: number;
};


export type PlantType ={
  id:string,
  name:string,
  category:string,
  image: string,
  description:string,
  idealMetrics: {
    soilMoisture: number[];
    humidity: number[];
    temperature: number[];
    light: number[];
  };
};

export type FirestorePlant = {
  id: string;
  userId: string;
  customName: string;
  plantTypeId: string;
  imageUri?: string;
  location?: string;
  createdAt: number;

  last: Reading | null;
  deviceId?: string | null;
};

export type IdealMetrics = {
  soilMoisture: number[];
  humidity: number[];
  temperature: number[];
  light: number[];
};

export type PlantTypeData ={
  name: string;
  category?: string;
  image: string;
  idealMetrics: IdealMetrics;
};

export type Device = {
  name: string;
  rssi: number;
  connected: boolean;
  plantId: string | null;
}


// Add EditProfile route
export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;

  MainTabs: {
    screen?: 'Dashboard' | 'MyPlants' | 'Scan' | 'Settings';
    params?: {
      selectedPlant?: PlantType;
    }
  };

  Dashboard: undefined;
  MyPlants: {selectedPlant?: PlantType } | undefined;
  Scan: undefined;
  Settings: undefined;

  AddPlant: undefined;
  AllPlants: undefined;
  PlantDetail: { plantId: string };
  Statistics: { plantId: string };

  EditProfile: undefined;
};
