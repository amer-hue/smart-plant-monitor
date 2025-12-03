export type Reading = {
  moisture: number;
  tempC: number;
  light: number;
  ts: number;
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
