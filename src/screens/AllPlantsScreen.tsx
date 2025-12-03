import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PlantType, RootStackParamList } from '../types';
import { db } from "../utils/firebaseConfig";

type NavProp = StackNavigationProp<RootStackParamList, 'AllPlants'>;


export default function AllPlantsScreen(){
    const navigation = useNavigation<NavProp>();

    const [plants, setPlants] = useState<PlantType[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [selected, setSelected] = useState<PlantType | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(prev => (prev === id ? null: id));
    }

    useEffect(() => {
        const load = async() => {
            const snap = await getDocs(collection(db, "plantTypes"));
            setPlants(snap.docs.map(doc => doc.data() as PlantType));
        };
        load();
    }, []);

    const handleSelect = () => {
        if(!selected) return;

        navigation.reset({
            index: 0,
            routes: [
                {
                    name: "MainTabs",
                    params: {
                        screen: "MyPlants",
                        params: {selectedPlant: selected}
                    }
                }
            ]
        })

        };

    return(
        <View style = {{flex: 1, backgroundColor: "#121212"}}>
        <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style = {styles.backButton}>
                <Ionicons name = "chevron-back" size ={28} color = "#fff"/>
            </TouchableOpacity>

        <ScrollView style ={{flex: 1, backgroundColor: "#121212", padding: 20}}>

            {plants.map((p) => {
                const isSelected = selected?.id == p.id;

                return(
                <TouchableOpacity key = {p.id} style = {[styles.card, isSelected && styles.selectedCard]} 
                onPress={() => setSelected(p)}
                activeOpacity={0.8}>
                    <Image source = {{uri: p.image}} style = {styles.image} />
                    <Text style = {styles.name}>{p.name}</Text>
                    <Text style = {styles.category}>{p.category}</Text>

                    <TouchableOpacity
                    onPress={() => toggleExpand(p.id)}
                    style={styles.expandButton}>
                    <Text style ={{color: "#4CAF50", fontWeight: "600"}}>
                        {expandedId === p.id ? "Hide Details ▲" : "View Details ▼"}
                    </Text>
                    </TouchableOpacity>

                    {expandedId === p.id && (
                        <View style={{marginTop: 10}}>
                            <Text style={styles.desc}>{p.description}</Text>
                            <Text style = {styles.metrics}>
                                Temp: {p.idealMetrics.temperature[0]}-{p.idealMetrics.temperature[1]} °C
                            </Text>
                            <Text style = {styles.metrics}>
                                Humidity: {p.idealMetrics.humidity[0]}-{p.idealMetrics.humidity[1]}
                            </Text>
                            <Text style = {styles.metrics}>
                                Soil Moisture: {p.idealMetrics.soilMoisture[0]}-{p.idealMetrics.soilMoisture[1]}
                            </Text>
                            <Text style = {styles.metrics}>
                                Light Level: {p.idealMetrics.light[0]}-{p.idealMetrics.light[1]}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
                );
                })}
        </ScrollView>

        <TouchableOpacity
        disabled={!selected}
            onPress={handleSelect}
            style={[styles.selectButton, !selected && {opacity: 0.4}]}
        >
            <Text style ={styles.selectButtonText}>Select Plant</Text>
        </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 10,
    borderColor: "#333",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: { color: "white", fontSize: 18, fontWeight: "600" },
  category: { color: "#4CAF50", marginTop: 5 
  },
  expandButton:{
    paddingVertical: 5,
  },
  desc: {
    color: "#ddd",
    marginBottom: 8,
    fontSize: 14,
  },
  metrics: {
    color: "#bbb",
    fontSize: 13,
    marginBottom: 4,
  },
  backButton:{
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 999,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCard: {
    borderColor: "#4CAF50",
    borderWidth: 2,
    backgroundColor: "#1a2a1a"
  },
  selectButton: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  selectButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

});