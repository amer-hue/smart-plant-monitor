import React, { createContext, useContext, useEffect, useReducer } from "react";
import { PlantType } from "../types";
import { auth, db } from "../utils/firebaseConfig";

type State = {
  plants: PlantType[];
  isFahrenheit: boolean;
};

type Action =
  | { type: "REMOVE_PLANT"; payload: string }
  | { type: "TOGGLE_TEMP_UNIT" }
  | { type: "SET_PLANTS"; payload: PlantType[] }
  | { type: "SET_TEMP_UNIT"; payload: boolean };

const initialState: State = {
  plants: [],
  isFahrenheit: false,
};

const plantReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "TOGGLE_TEMP_UNIT":
      return { ...state, isFahrenheit: !state.isFahrenheit };
    case "SET_TEMP_UNIT":
      return { ...state, isFahrenheit: action.payload };
    case "SET_PLANTS":
      return { ...state, plants: action.payload };
    default:
      return state;
  }
};

const PlantContext = createContext<any>(null);

export const PlantProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(plantReducer, initialState);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const unsub = db
      .collection("users")
      .doc(uid)
      .onSnapshot((doc) => {
        const data = doc.data() || {};
        dispatch({ type: "SET_TEMP_UNIT", payload: Boolean(data.isFahrenheit) });
      });

    return () => unsub();
  }, []);

  return (
    <PlantContext.Provider value={{ state, dispatch }}>
      {children}
    </PlantContext.Provider>
  );
};

export const usePlantStore = () => {
  const ctx = useContext(PlantContext);
  if (!ctx) throw new Error("usePlantStore must be inside provider");
  return ctx;
};
