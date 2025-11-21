import {initializeApp} from "firebase/app";
import {getFirestore, setDoc, doc} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQkQkaxzxSGiasxFnP245nG4IUbmyoeJM",
  authDomain: "smartplantmonitoringsyst-d8e1c.firebaseapp.com",
  projectId: "smartplantmonitoringsyst-d8e1c",
  storageBucket: "smartplantmonitoringsyst-d8e1c.appspot.com",
  messagingSenderId: "860807603387",
  appId: "1:860807603387:web:a608767503261252d9b59e",
  measurementId: "G-N1F4T8180Q",
};
//{
    id: "",
    name: "",
    category: "Indoor",
    image: "",
    description: "",
    idealMetrics: {
      soilMoisture: [30, 50],
      humidity: [40, 60],
      temperature: [18, 29], // C°
      light: [500, 2500]
    }
  },

const plantTypes = [
  {
    id: "pothos",
    name: "Pothos (Epipremnum aureum)",
    category: "Indoor",
    image: "https://unsplash.com/photos/green-leaves-in-tilt-shift-lens-Q0geXolSohI",
    description: "A fast-growing, low-maintenance trailing plant.",
    idealMetrics: {
      soilMoisture: [30, 50],
      humidity: [40, 60],
      temperature: [18, 29], // C°
      light: [500, 2500]
    }
  },

  {
    id: "snakeplant",
    name: "Snake Plant (Dracaena trifasciata) ",
    category: "Indoor",
    image: "https://unsplash.com/photos/green-plant-in-white-pot-iIuyXTcEBTI",
    description: "The snake plant is a carefree, resilient houseplant that makes a bold, architectural statement in your home with tall, swordlike leaves and unique variegation. Tolerant of most growing conditions, it is an ideal plant for beginners or those who want an easy-to-grow houseplant.",
    idealMetrics: {
      soilMoisture: [30, 50],
      humidity: [30, 50],
      temperature: [18, 29], // C°
      light: [500, 2500]
    }
  },

  {
    id: "spiderplant",
    name: "Spider Plant (Chlorophytum comosum) ",
    category: "Indoor",
    image: "https://unsplash.com/photos/green-leaf-plant-in-pot-Si8rYoK5tf0",
    description: "This easy-to-grow plant features cascading green and white leaves. Long arching stems develop with small plants that have a spider-like appearance. It adapts to various light conditions, from bright indirect light to shade, and prefers humid environments.",
    idealMetrics: {
      soilMoisture: [35, 55],
      humidity: [40, 60],
      temperature: [18, 27], // C°
      light: [500, 10000]
    }
  },
  
  {
    id: "monstera",
    name: "Monstera",
    category: "Indoor",
    image: "https://unsplash.com/photos/a-close-up-of-a-large-green-leafy-plant-2pTYBhn6U3s",
    description: "Also known as the Swiss cheese plant, the monstera is prized for its large, heart-shaped leaves with unique gaps and splits. It comes in various variegated options and thrives in moderate light with well-drained soil. Monstera was featured in many Matisse paintings and has continued its popularity over the decades.  It is a versatile houseplant used for home decorations and can reach 6-10' x 6’ at maturity in the home. ",
    idealMetrics: {
      soilMoisture: [40, 60],
      humidity: [55, 80],
      temperature: [18, 30], // C°
      light: [2000, 20000]
    }
  },

  {
    id: "zzplant",
    name: "ZZ Plant (Zamioculcas zamiifolia) ",
    category: "Indoor",
    image: "https://unsplash.com/photos/green-plant-near-white-window-blinds-E2alKuiCUKY",
    description: "The ZZ plant is a low-maintenance, clump-forming house plant with upright stems with many attractive, glossy leaves.  ‘Black Raven’ ZZ plant is one of the black-foliaged cultivars that is highly coveted. It tolerates a wide range of light conditions, from bright sun to shade. A ZZ plant can reach 3-5’ x 2-3’ at maturity in the house. ",
    idealMetrics: {
      soilMoisture: [30, 50],
      humidity: [40, 60],
      temperature: [18, 29], // C°
      light: [500, 2500]
    }
  },

  {
    id: "treephilodendron",
    name: "Tree Philodendron (Philodendron selloum) ",
    category: "Indoor",
    image: "https://unsplash.com/photos/a-close-up-of-a-green-leaf-on-a-plant-Rhgs38xTCk8",
    description: "The philodendron has very large leaves with very lobed and incised leaves which are a dark glossy green. This large-foliaged house plant has gained in popularity due to its impact on complimenting home décor.  It can tolerate low-light conditions.  ‘Shangri-La’ is a new selection which has very textural leaves. It can tolerate bright indirect light to low light conditions.  A warm and humid room will result in luxuriant growth. ",
    idealMetrics: {
      soilMoisture: [30, 50],
      humidity: [40, 60],
      temperature: [18, 29], // C°
      light: [500, 2500]
    }
  },

  {
    id: "jadeplant",
    name: "Jade Plant (Crassula ovata) ",
    category: "Indoor",
    image: "https://unsplash.com/photos/green-plant-on-white-ceramic-pot-nKyN0Lfy-1w",
    description: "A popular succulent, the jade plant has thick, oval leaves and a shrub-like appearance. It requires minimal watering and thrives in bright, direct sunlight. This has been a popular houseplant for over 60 years.  Because it is a succulent, it requires very little care to be a very successful houseplant. ",
    idealMetrics: {
      soilMoisture: [30, 50],
      humidity: [40, 60],
      temperature: [18, 29], // C°
      light: [500, 2500]
    }
  },

  {
    id: "rubberplant",
    name: "Rubber Plant (Ficus elastica)",
    category: "Indoor",
    image: "https://unsplash.com/photos/green-leaves-in-white-background-Dze_6fnPIKk",
    description: "A classic houseplant, the rubber plant features large, glossy, leathery leaves and can grow quite tall. It adapts to varying light conditions, making it a versatile choice for any room. This old-fashioned houseplant has stood the test of time. It also makes a great architectural statement in the home. ",
    idealMetrics: {
      soilMoisture: [30, 50],
      humidity: [40, 60],
      temperature: [18, 29], // C°
      light: [500, 2500]
    }
  },

  {
    id: "peacelily",
    name: "Peace Lily (Spathiphyllum sp.) ",
    category: "Indoor",
    image: "https://unsplash.com/photos/white-flower-with-green-leaves-CDoPIWJDvvw",
    description: "This elegant plant features white flowers amidst dark green foliage. It prefers indirect light and thrives in moist, well-drained soil. The peace lily has been especially popular in office buildings and malls, but increasingly has become a stalwart houseplant due to its durability. It needs indirect to low light conditions, and should dry out completely between waterings. ",
    idealMetrics: {
      soilMoisture: [30, 50],
      humidity: [40, 60],
      temperature: [18, 29], // C°
      light: [500, 2500]
    }
  },

  {
    id: "",
    name: "",
    category: "Indoor",
    image: "",
    description: "",
    idealMetrics: {
      soilMoisture: [30, 50],
      humidity: [40, 60],
      temperature: [18, 29], // C°
      light: [500, 2500]
    }
  },
  // Add the other 39 plants here…
];