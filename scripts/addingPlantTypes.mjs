import admin from "firebase-admin";
import { readFileSync } from "fs";

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(readFileSync("scripts/serviceAccountKey.json"))
  )
});

const db = admin.firestore();

const firebaseConfig = {
  apiKey: "AIzaSyDGOW_TLCnbWy2ZBAQXa3w6OV4h7-buPGA",
  authDomain: "smartplantmonitoringsyst-d8e1c.firebaseapp.com",
  projectId: "smartplantmonitoringsyst-d8e1c",
  storageBucket: "smartplantmonitoringsyst-d8e1c.appspot.com",
  messagingSenderId: "860807603387",
  appId: "1:860807603387:web:a608767503261252d9b59e",
  measurementId: "G-N1F4T8180Q",
};
//Document structure for any new plants
//{
//    id: "",
 //   name: "",
//    category: "Indoor",
//    image: "",
//    description: "",
//    idealMetrics: {
//      soilMoisture: [30, 50],
//      humidity: [40, 60],
//      temperature: [18, 29], // C°
//      light: [500, 2500]
 //   }
 // },

const plantTypes = [
  {
    //10 indoor plants (succulents =)
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
      soilMoisture: [20, 40],
      humidity: [30, 50],
      temperature: [18, 30], // C°
      light: [200, 2000]
    }
  },

  {
    id: "treephilodendron",
    name: "Tree Philodendron (Philodendron selloum) ",
    category: "Indoor",
    image: "https://unsplash.com/photos/a-close-up-of-a-green-leaf-on-a-plant-Rhgs38xTCk8",
    description: "The philodendron has very large leaves with very lobed and incised leaves which are a dark glossy green. This large-foliaged house plant has gained in popularity due to its impact on complimenting home décor.  It can tolerate low-light conditions.  ‘Shangri-La’ is a new selection which has very textural leaves. It can tolerate bright indirect light to low light conditions.  A warm and humid room will result in luxuriant growth. ",
    idealMetrics: {
      soilMoisture: [40, 60],
      humidity: [50, 80],
      temperature: [18, 30], // C°
      light: [2000, 10000]
    }
  },

  {
    id: "chineseevergreen",
    name: "Chinese Evergreen (Aglaonema modestum) ",
    category: "Indoor",
    image: "https://unsplash.com/photos/green-plant-obekvwYFdsc",
    description: "This lush plant features heart-shaped leaves with variegated patterns in shades of green, silver, white, and pink. It tolerates low light conditions and prefers moist, well-drained soil. ",
    idealMetrics: {
      soilMoisture: [35, 55],
      humidity: [50, 70],
      temperature: [18, 27], // C°
      light: [200, 2500]
    }
  },

  {
    id: "rubberplant",
    name: "Rubber Plant (Ficus elastica)",
    category: "Indoor",
    image: "https://unsplash.com/photos/green-leaves-in-white-background-Dze_6fnPIKk",
    description: "A classic houseplant, the rubber plant features large, glossy, leathery leaves and can grow quite tall. It adapts to varying light conditions, making it a versatile choice for any room. This old-fashioned houseplant has stood the test of time. It also makes a great architectural statement in the home. ",
    idealMetrics: {
      soilMoisture: [35, 55],
      humidity: [40, 60],
      temperature: [18, 29], // C°
      light: [2000, 10000]
    }
  },

  {
    id: "peacelily",
    name: "Peace Lily (Spathiphyllum sp.) ",
    category: "Indoor",
    image: "https://unsplash.com/photos/white-flower-with-green-leaves-CDoPIWJDvvw",
    description: "This elegant plant features white flowers amidst dark green foliage. It prefers indirect light and thrives in moist, well-drained soil. The peace lily has been especially popular in office buildings and malls, but increasingly has become a stalwart houseplant due to its durability. It needs indirect to low light conditions, and should dry out completely between waterings. ",
    idealMetrics: {
      soilMoisture: [45, 65],
      humidity: [50, 80],
      temperature: [18, 27], // C°
      light: [500, 5000]
    }
  },

  {
    id: "stringofpearls",
    name: "String-of-Pearls (Senecio rowleyanus) ",
    category: "Indoor",
    image: "https://unsplash.com/photos/green-and-brown-rope-with-brown-rope-tRU_e2bsFuI",
    description: "A succulent with cascading stems of orb-like leaves resembling pearls, the string-of-pearls is a unique and low-maintenance houseplant. It requires full sun and well-drained soil, such as a cactus mix.  ",
    idealMetrics: {
      soilMoisture: [15, 30],
      humidity: [30, 50],
      temperature: [18, 27], // C°
      light: [10000, 50000]
    }
  },

  {
    id: "jadeplant",
    name: "Jade Plant (Crassula ovata) ",
    category: "Indoor",
    image: "https://unsplash.com/photos/green-plant-on-white-ceramic-pot-nKyN0Lfy-1w",
    description: "A popular succulent, the jade plant has thick, oval leaves and a shrub-like appearance. It requires minimal watering and thrives in bright, direct sunlight. This has been a popular houseplant for over 60 years.  Because it is a succulent, it requires very little care to be a very successful houseplant. ",
    idealMetrics: {
      soilMoisture: [20, 35],
      humidity: [30, 50],
      temperature: [18, 29], // C°
      light: [10000, 70000]
    }
  },

  {
    id: "aloevera",
    name: "Aloe Vera (Barbados Aloe)",
    category: "Indoor",
    image: "https://unsplash.com/photos/green-plant-in-white-background-q3szjB0Lj8w",
    description: "https://unsplash.com/photos/green-and-brown-rope-with-brown-rope-tRU_e2bsFuI",
    idealMetrics: {
      soilMoisture: [15, 30],
      humidity: [30, 50],
      temperature: [18, 32], // C°
      light: [15000, 70000]
    }
  },

  {
    id: "roseum",
    name: "Roseum (sedum spurium)",
    category: "Indoor",
    image: "",
    description: "The roseum plant is a low-growing succulent that only gets to be about four to six inches tall. It is a fast grower that works great in containers or planters on a windowsill. In the summer, the roseum develops clusters of light-pink star flowers that can add a pop of color to your home decor.",
    idealMetrics: {
      soilMoisture: [10, 25],
      humidity: [30, 50],
      temperature: [15, 30], // C°
      light: [20000, 90000]
    }
  },

  {
    id: "zebracactus",
    name: "Zebra Cactus (Haworthia fasciata)",
    category: "Indoor",
    image: "",
    description: "The Zebra Haworthia is a compact, low-maintenance succulent that thrives indoors with minimal care. It prefers bright, indirect light and requires infrequent watering, making it ideal for beginners. With its distinctive white-striped leaves, this hardy plant tolerates a variety of conditions, provided the soil is well-draining and not overwatered. It is well-suited for small spaces, making it a popular choice for tabletops, windowsills, and office settings.",
    idealMetrics: {
      soilMoisture: [10, 25],
      humidity: [30, 50],
      temperature: [18, 27], // C°
      light: [10000, 50000]
    }
  },

  {
    id: "lavender",
    name: "Lavender (Lavandula angustifolia)",
    category: "Outdoor",
    image: "https://unsplash.com/photos/lavender-flower-field-blooms-at-daytime-NrflUuJJK0I",
    description: "English lavender is an aromatic shrub that can grow up to 2m tall, as a wooden-stemmed shrubs or a non-woody herb. The leaves are evergreen, narrow spear-shaped, around 4cm long, and 5mm across. The flowers are usually light to dark purple, although there are white varieties, and grow in clusters at the top of slim stems.",
    idealMetrics: {
      soilMoisture: [20, 35],
      humidity: [20, 50],
      temperature: [15, 30], // C°
      light: [20000, 90000]
    }
  },

  {
    id: "hydrangea",
    name: "Hydrangea (Hydrangea macrophylla)",
    category: "Outdoor",
    image: "https://unsplash.com/photos/purple-and-white-flower-in-close-up-photography-bOtoEyKxEJo",
    description: "Hydrangeas are deciduous shrubs or vines known for their large, showy clusters of flowers that bloom in a variety of colors, including blue, pink, white, and purple. The color of the blooms can change depending on the soil's pH level, with blue flowers in acidic soil and pink in alkaline soil. Their large flower heads, which can be mophead, lacecap, or panicle in shape, make them popular for gardens and floral arrangements",
    idealMetrics: {
      soilMoisture: [40, 60],
      humidity: [40, 70],
      temperature: [10, 26], // C°
      light: [1000, 5000]
    }
  },

  {
    id: "rose",
    name: "Rose (Rosa spp.)",
    category: "Outdoor",
    image: "https://unsplash.com/photos/a-close-up-of-a-single-flower-on-a-branch-ZK0xckJqBXs",
    description: "This flower comes in a variety of forms, from the more traditional shrubs and climbers, to miniature pot plants. Their stems are usually prickly and their glossy, green leaves have toothed edges. Rose flowers vary in size and shape. They burst with colours ranging from pastel pink, peach, and cream, to vibrant yellow, orange, and red. Many roses are fragrant, and some produce berry-like fruits called hips.",
    idealMetrics: {
      soilMoisture: [40, 60],
      humidity: [40, 70],
      temperature: [15, 32], // C°
      light: [20000, 90000]
    }
  },

  {
    id: "gardenia",
    name: "Gardenia (Gardenia jasminoides)",
    category: "Outdoor",
    image: "https://unsplash.com/photos/a-couple-white-flowers-KTnDIugUMW8",
    description: "Gardenias have glossy evergreen leaves that usually are arranged oppositely or in whorls. The tubular flowers are white or yellow and are borne singly or in small clusters; the flowers are often strongly scented.",
    idealMetrics: {
      soilMoisture: [45, 65],
      humidity: [60, 80],
      temperature: [18, 27], // C°
      light: [5000, 15000]
    }
  },

  {
    id: "hibiscus",
    name: "Hibiscus (Hibiscus rosa-sinensis)",
    category: "Outdoor",
    image: "https://unsplash.com/photos/red-hibiscus-in-bloom-during-daytime-exLsCzoU8_M",
    description: "The hibiscus is an evergreen shrub, growing to a maximum of 10 m in the wild. Its bark is light-grey, easy to peel and smooth. Hibiscus leaves are ovate, simple and 8 to 10.5 cm long. They are spirally arranged around a long stalk. The flowers are bisexual, large and showy, grow up to 25 cm wide, stalked and arising singly from the upper leaf axils. The five free petals joined at the base may be white, yellow or red colour.",
    idealMetrics: {
      soilMoisture: [45, 65],
      humidity: [50, 80],
      temperature: [18, 32], // C°
      light: [15000, 80000]
    }
  },

  {
    id: "azalea",
    name: "Azalea (Rhododendron spp.)",
    category: "Outdoor",
    image: "https://unsplash.com/photos/pink-flowers-in-tilt-shift-lens-xvgfN608odk",
    description: "Azaleas are a type of Rhododendron which are woody shrubs of great variety in size and color. They range from 2'-10' typically and have colors all across the rainbow but predominately whites and pinks. They need rich acid soil and ample water. One of the most elegant show plants in any garden.",
    idealMetrics: {
      soilMoisture: [40, 60],
      humidity: [50, 80],
      temperature: [10, 25], // C°
      light: [1000, 8000]
    }
  },

  {
    id: "boxwood",
    name: "Boxwood (Buxus sempervirens)",
    category: "Outdoor",
    image: "https://unsplash.com/photos/green-plant-near-brown-building-during-daytime-lEikWeCu5xk",
    description: "The Boxwood is a thick shrub and a member of the evergreen family. The Boxwood was first used in Egypt in 4000 BC. The Egyptians planted the boxwood in their gardens and trimmed them into formal hedges. Other cultures have used it was to make woodcuts and precision instruments.",
    idealMetrics: {
      soilMoisture: [30, 50],
      humidity: [30, 60],
      temperature: [5, 30], // C°
      light: [5000, 50000]
    }
  },

  {
    id: "juniper",
    name: "Juniper (Juniperus spp.)",
    category: "Outdoor",
    image: "https://unsplash.com/photos/green-juniper-branches-with-small-blue-berries-Hlu-Dz0BGCU",
    description: "Junipers vary in size and shape from tall trees, 20–40 metres (66–131 feet) tall, to columnar or low-spreading shrubs with long, trailing branches. They are evergreen with needle-like and/or scale-like leaves.",
    idealMetrics: {
      soilMoisture: [15, 35],
      humidity: [20, 50],
      temperature: [5, 35], // C°
      light: [20000, 90000]
    }
  },

  {
    id: "japanesemaple",
    name: "Japanese Maple (Acer palmatum)",
    category: "Outdoor",
    image: "https://unsplash.com/photos/a-tree-with-yellow-leaves-and-a-blue-sky-in-the-background-jn1LifQL-qM",
    description: "The leaves of Japanese maples are deeply lobed with seven to nine pointed, toothed lobes. The lobes can be wide to very thin, wispy, and feather-like. The leaf color varies from green to red to burgundy or deep purple, depending on the variety.",
    idealMetrics: {
      soilMoisture: [35, 55],
      humidity: [40, 70],
      temperature: [10, 28], // C°
      light: [2000, 15000]
    }
  },

  {
    id: "fernoutdoor",
    name: "Fern (Outdoor) (Nephrolepis exaltata)",
    category: "Indoor",
    image: "https://unsplash.com/photos/green-fern-plant-during-nighttime-HRcyrG2VeZA",
    description: "Ferns are characterized by their graceful fronds, which uncoil from tight spirals known as fiddleheads. These plants are not only aesthetically pleasing but also beneficial for improving air quality and increasing humidity. In garden design, ferns are versatile players.",
    idealMetrics: {
      soilMoisture: [50, 70],
      humidity: [60, 90],
      temperature: [15, 30], // C°
      light: [500, 3000]
    }
  },

  {
    id: "marigold",
    name: "Marigold (Tagetes erecta)",
    category: "Outdoor",
    image: "https://unsplash.com/photos/a-field-of-orange-flowers-with-trees-in-the-background-uFL5P_t8HEA",
    description: "Marigolds are easy to grow, economical, bloom reliably all summer, and have few insect and disease problems. These bright, cheerful flowers thrive in South Carolina’s warm climate and are suitable for both beginner and experienced gardeners.",
    idealMetrics: {
      soilMoisture: [35, 55],
      humidity: [30, 60],
      temperature: [18, 32], // C°
      light: [20000, 90000]
    }
  },

  {
    id: "Petunia",
    name: "Petunia (Petunia × hybrida)",
    category: "Outdoor",
    image: "https://unsplash.com/photos/purple-and-yellow-flowers-J1cmwO2FHFI",
    description: "Petunias are among the most popular flowering annuals. Petunias are bright and lively, bloom from spring until frost, and scent the air with fragrance. They are amazingly easy to grow, both in the garden and in containers.",
    idealMetrics: {
      soilMoisture: [40, 60],
      humidity: [40, 70],
      temperature: [15, 30], // C°
      light: [15000, 70000]
    }
  },

  {
    id: "daisy",
    name: "Daisy (Leucanthemum vulgare)",
    category: "Outdoor",
    image: "https://unsplash.com/photos/a-bunch-of-white-flowers-with-yellow-centers-f8Nh23S3IsY",
    description: "Daisies include a central, buttonlike disk of microscopic flowers encompassed by a ring of raylike petals. The similarities end here. The central disk can be flat, concave, or convex in form. Colors can vary from the classic yellow to black, dark brown, or even exotic purple.",
    idealMetrics: {
      soilMoisture: [30, 50],
      humidity: [30, 60],
      temperature: [10, 28], // C°
      light: [20000, 90000]
    }
  },

  {
    id: "sunflower",
    name: "Sunflower (Helianthus annuus)",
    category: "Outdoor",
    image: "https://unsplash.com/photos/sunflower-field-under-blue-sky-during-daytime-2IzoIHBgYAo",
    description: "The common sunflower has a green erect stem covered in coarse hairs, growing on average around 2m tall. The leaves are broad, with serrated edges, and are alternately arranged on the stem. The 'flower' of the common sunflower is actually a pseudanthium, or flowerhead, made up of many small flowers.",
    idealMetrics: {
      soilMoisture: [35, 55],
      humidity: [30, 60],
      temperature: [18, 32], // C°
      light: [50000, 100000]
    }
  },

  {
    id: "geranium",
    name: "Geranium (Pelargonium spp.)",
    category: "Outdoor",
    image: "https://unsplash.com/photos/pink-petaled-flower-wxZJ-V6DPKc",
    description: "Geraniums often have distinct leaf markings. There are fancy-leafed selections with tri-colored leaves, silver leaves and leaves with white markings. Flower colors are usually pink, red, salmon or white. A zonal geranium with white edged leaves.",
    idealMetrics: {
      soilMoisture: [35, 55],
      humidity: [30, 60],
      temperature: [10, 30], // C°
      light: [15000, 70000]
    }
  },
  //herbs
  {
    id: "basil",
    name: "Basil (Ocimum basilicum)",
    category: "herb",
    image: "https://unsplash.com/photos/green-leaves-in-macro-lens-0wWYos3ZGqU",
    description: "Basil is an annual herbaceous plant in the mint family Lamiaceae. It has square stems with leaves that grow on opposite sides, and the leaves are rounded, slightly cupped, and curve to form at point at the tip.",
    idealMetrics: {
      soilMoisture: [40, 60],
      humidity: [40, 60],
      temperature: [20, 30], // C°
      light: [20000, 80000]
    }
  },

  {
    id: "rosemary",
    name: "Rosemary (Rosmarinus officinalis)",
    category: "herb",
    image: "https://unsplash.com/photos/a-close-up-of-a-bunch-of-pine-needles-DI7nHnvUNsI",
    description: "Rosemary is a fragrant, evergreen shrub with needle-like leaves and two-lipped, purplish-blue and white flowers. New growth is soft and flexible but older stems become woody and form trunks with time.",
    idealMetrics: {
      soilMoisture: [20, 35],
      humidity: [20, 50],
      temperature: [15, 30], // C°
      light: [20000, 90000]
    }
  },

  {
    id: "mint",
    name: "Mint (Mentha spicata)",
    category: "herb",
    image: "https://unsplash.com/photos/green-leaves-plant-during-daytime-bHWRSq8fUUE",
    description: "Mint plants are mainly aromatic perennials and they possess erect, branching stems and oblong to ovate or lanceolate leaves arranged in opposing pairs on the stems. The leaves are often covered in tiny hairs and have a serrated margin.",
    idealMetrics: {
      soilMoisture: [50, 70],
      humidity: [50, 80],
      temperature: [15, 27], // C°
      light: [5000, 20000]
    }
  },
  
  {
    id: "thyme",
    name: "Thyme (Thymus vulgaris)",
    category: "herb",
    image: "https://unsplash.com/photos/pink-flowers-in-tilt-shift-lens-qjuJBB5BsAY",
    description: "Thyme is a small perennial shrub that grows 4-12 inches in height with slender, wiry, and spreading branches. It has small green-grey evergreen leaves and violet-colored flowers. Thyme prefers dry chalky soil and tolerates drought once it is established. It thrives in full sun, but also tolerates partial shade.",
    idealMetrics: {
      soilMoisture: [20, 35],
      humidity: [20, 50],
      temperature: [15, 30], // C°
      light: [20000, 90000]
    }
  },

  {
    id: "parsley",
    name: "Parsley (Petroselinum crispum)",
    category: "herb",
    image: "https://unsplash.com/photos/green-plant-in-close-up-photography-N73L0EzbJ8Y",
    description: "Parsley is an herb grown for the pungent flavored leaves. Parsley, Petroselinum crispum, is a hardy biennial in the carrot family (Umbelliferae/Apiaceae) generally grown for its flavorful, dark green leaves that are a rich source of vitamin C, vitamin A and iron.",
    idealMetrics: {
      soilMoisture: [40, 60],
      humidity: [40, 70],
      temperature: [10, 25], // C°
      light: [5000, 30000]
    }
  },
  
  {
    id: "cilantro",
    name: "Cilantro (Coriandrum sativum)",
    category: "herb",
    image: "https://unsplash.com/photos/a-close-up-of-a-bunch-of-green-leaves-9xzw4l722jc",
    description: "Cilantro is a pungent herb that is easy to grow. Coriandrum sativum is a fast-growing annual with two common names: the leaves are the herb cilantro or Chinese parsley and the seeds are the spice coriander.",
    idealMetrics: {
      soilMoisture: [35, 55],
      humidity: [40, 70],
      temperature: [10, 24], // C°
      light: [5000, 30000]
    }
  },
  
  {
    id: "chives",
    name: "Chives (Allium schoenoprasum)",
    category: "herb",
    image: "https://unsplash.com/photos/purple-flower-in-tilt-shift-lens-2QoaJ2Meupk",
    description: "Chives are long, thin, hollow, grass-like leaves from a perennial plant in the onion family, with a mild, delicate onion-like flavor. They grow in clumps, topped with decorative, edible, star-shaped purple flowers, and are used as a garnish or flavoring in a wide range of dishes",
    idealMetrics: {
      soilMoisture: [35, 55],
      humidity: [40, 70],
      temperature: [10, 26], // C°
      light: [5000, 30000]
    }
  },
  
  {
    id: "oregano",
    name: "Oregano (Origanum vulgare)",
    category: "herb",
    image: "https://unsplash.com/photos/a-close-up-of-a-bunch-of-green-leaves-yX1IN-7fAkw",
    description: "Oregano is a perennial herb with small, aromatic, oval-shaped leaves, typically green or grey-green. It is a woody plant with stems that can become woody at the base as it matures. Its flowers are often purple, white, or pink. Known for its strong, spicy, and pungent flavor, oregano is a key ingredient in many cuisines and comes in many varieties, including Greek, Italian, and Mexican.  ",
    idealMetrics: {
      soilMoisture: [20, 40],
      humidity: [30, 60],
      temperature: [15, 30], // C°
      light: [15000, 90000]
    }
  },
  
  {
    id: "sage",
    name: "Sage (Salvia officinalis)",
    category: "herb",
    image: "https://unsplash.com/photos/a-close-up-of-a-bunch-of-green-leaves-t2b-g_ObhV4",
    description: "Sage is an aromatic, rather woody perennial shrub in the mint family (Lamiaceae) native to the shores of the northern Mediterranean. Its common names include culinary sage, common garden sage, or garden sage.",
    idealMetrics: {
      soilMoisture: [20, 40],
      humidity: [30, 60],
      temperature: [15, 30], // C°
      light: [20000, 90000]
    }
  },
  
  {
    id: "dill",
    name: "Dill (Anethum graveolens)",
    category: "herb",
    image: "https://unsplash.com/photos/a-close-up-of-a-bunch-of-green-grass-kgb34f0HRSc",
    description: "Dill is a tall, feathery herb with fine, blue-green or dark green leaves known as dill weed. It is a member of the celery family, with a fresh, slightly citrus-like, and grassy flavor. The plant produces clusters of small, yellow flowers that lead to flat, oval seeds, also used as a spice",
    idealMetrics: {
      soilMoisture: [35, 55],
      humidity: [40, 60],
      temperature: [15, 27], // C°
      light: [10000, 60000]
    }
  },
  
  //FRUITS
  {
    id: "strawberry",
    name: "Strawberry (Fragaria × ananassa)",
    category: "fruit",
    image: "https://unsplash.com/photos/strawberries-in-shallow-focus-rfK7qmyPOEg",
    description: "A strawberry plant is a low-growing, herbaceous perennial in the rose family that features a crown near the ground, compound leaves with three toothed leaflets, and a shallow root system. It produces white flowers and develops a red, fleshy fruit with the seeds (ovaries) on the outside. These plants spread via runners, which are long stems that grow along the ground and send down roots to form new plants.",
    idealMetrics: {
      soilMoisture: [40, 60],
      humidity: [50, 70],
      temperature: [15, 27], // C°
      light: [20000, 80000]
    }
  },
  
  {
    id: "blueberry",
    name: "Blueberry (Vaccinium corymbosum)",
    category: "fruit",
    image: "https://unsplash.com/photos/blue-berries-on-a-tree-YoES76S_8Uc",
    description: "A blueberry plant is a deciduous woody shrub with a shallow root system that produces a blue-black berry. It has alternate, simple leaves that are green in the summer and turn brilliant red, orange, and yellow in the fall. ",
    idealMetrics: {
      soilMoisture: [45, 70],
      humidity: [50, 70],
      temperature: [10, 25], // C°
      light: [15000, 70000]
    }
  },
  
  {
    id: "lemon",
    name: "Lemon (Citrus limon)",
    category: "fruit",
    image: "https://unsplash.com/photos/orange-fruits-under-blue-sky-cUaXzFXVKkA",
    description: "A lemon plant is a small, evergreen tree (Citrus x limon) in the Rutaceae family, typically reaching 10 to 20 feet tall and featuring glossy leaves and sharp thorns on its branches. It produces fragrant white or purplish-tinged flowers and a yellow, oval fruit with a sour, acidic taste, a thick rind, and 8 to 10 segments inside. ",
    idealMetrics: {
      soilMoisture: [35, 55],
      humidity: [40, 60],
      temperature: [18, 32], // C°
      light: [30000, 90000]
    }
  },
  
  {
    id: "apple",
    name: "Apple tree (Malus domestica)",
    category: "fruit",
    image: "https://unsplash.com/photos/a-tree-filled-with-lots-of-red-apples-GvqG5tKsPBE",
    description: "An apple tree is a deciduous fruit tree with simple, ovate leaves, and showy, five-petaled flowers that are white to pink. Its bark is red-brown to gray-brown with scaly ridges, and its fruit is a pome (apple) that can be red, yellow, or green. Apple trees are generally hardy, require full sun, and are adaptable to various soils but benefit from well-drained sandy loam",
    idealMetrics: {
      soilMoisture: [35, 55],
      humidity: [30, 60],
      temperature: [10, 25], // C°
      light: [20000, 90000]
    }
  },
  
  {
    id: "raspberry",
    name: "Raspberry (Rubus idaeus)",
    category: "fruit",
    image: "https://unsplash.com/photos/raspberries-growing-on-a-bush-with-green-leaves-nyBJyqF6hBw",
    description: "A raspberry plant is a perennial shrub with biennial, cane-like stems that are often prickly. These stems grow one year and produce fruit the next, though some varieties are everbearing and fruit in the first year. The plant has alternate, compound leaves with 3-5 leaflets and produces white or pink flowers.",
    idealMetrics: {
      soilMoisture: [40, 60],
      humidity: [40, 70],
      temperature: [15, 25], // C°
      light: [20000, 80000]
    }
  },
  

  //VEGETABLES
  {
    id: "tomato",
    name: "Tomato (Solanum lycopersicum)",
    category: "vegetable",
    image: "https://unsplash.com/photos/a-bunch-of-tomatoes-growing-on-a-vine-2iU0MzpJIZA",
    description: "A tomato plant is a branched, hairy, and odorous plant that can grow as a bush or a long, sprawling vine. It features compound leaves with multiple leaflets and produces clusters of small, five-petaled yellow flowers. After pollination, the flowers develop into the edible, fleshy fruit (a berry) that comes in many colors and shapes.",
    idealMetrics: {
      soilMoisture: [45, 65],
      humidity: [40, 70],
      temperature: [18, 30], // C°
      light: [30000, 100000]
    }
  },
  
  {
    id: "lettuce",
    name: "Lettuce (Lactuca sativa)",
    category: "vegetable",
    image: "https://unsplash.com/photos/a-close-up-of-a-green-leafy-vegetable-Fmym18HAjv0",
    description: "Lettuce is an annual leafy green vegetable grown for its leaves, which are commonly eaten raw in salads and sandwiches. It belongs to the family Asteraceae and is a cool-season crop. The plant thrives in full sun to partial shade in fertile, well-drained soil, and varieties include romaine, butterhead, iceberg, and loose-leaf types. ",
    idealMetrics: {
      soilMoisture: [50, 70],
      humidity: [50, 80],
      temperature: [15, 18], // C°
      light: [5000, 25000]
    }
  },
  
  {
    id: "bellpepper",
    name: "Bell Pepper (Capsicum annuum)",
    category: "vegetable",
    image: "https://unsplash.com/photos/green-and-red-bell-pepper-xHnZIPZNxZk",
    description: "A bell pepper plant is a bushy, herbaceous plant from the Solanaceae (nightshade) family that typically grows 18 to 36 inches tall and produces large, fleshy, bell-shaped fruits. It has glossy, oval-shaped leaves, small white or purple flowers, and bears fruits that mature from green to other colors like red, yellow, orange, purple, and brown.",
    idealMetrics: {
      soilMoisture: [40, 60],
      humidity: [40, 70],
      temperature: [18, 30], // C°
      light: [20000, 90000]
    }
  },
  
  {
    id: "carrot",
    name: "Carrot (Daucus carota)",
    category: "vegetable",
    image: "https://unsplash.com/photos/a-pile-of-carrots-sitting-next-to-each-other-d9gDUaDpnes",
    description: "A carrot plant is a biennial herbaceous plant that produces a fleshy taproot and feathery leaves. It features an erect stem, especially in its second year, and small white or pinkish flowers clustered in flat, umbrella-like shapes called umbels. The plant is famous for its edible taproot, which is most commonly orange but also comes in other colors like purple, white, and yellow. ",
    idealMetrics: {
      soilMoisture: [40, 60],
      humidity: [40, 60],
      temperature: [10, 25], // C°
      light: [10000, 50000]
    }
  },
  
  {
    id: "cucumber",
    name: "Cucumber (Cucumis sativus)",
    category: "vegetable",
    image: "https://unsplash.com/photos/green-cucumbers-growing-on-a-vine-in-a-pot-UbITmwq7CYY",
    description: "A cucumber plant is a sprawling annual vine with large, hairy leaves, growing on a vine that can spread along the ground or climb using tendrils. It produces yellow, bowl-shaped flowers, and its fruit is a cylindrical or elongated berry called a pepo, which starts as a small, cylindrical structure at the base of the female flower. The fruit's skin is smooth or spiky and its color can range from yellow-green to dark green, depending on the variety and ripeness.",
    idealMetrics: {
      soilMoisture: [50, 70],
      humidity: [50, 70],
      temperature: [18, 30], // C°
      light: [20000, 90000]
    }
  },
  
  
];

for (const plant of plantTypes) {
  await db.collection("plantTypes").doc(plant.id).set(plant);
  console.log("Added:", plant.id);
}

console.log("finished adding plants to db");
process.exit(0);