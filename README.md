# 🌱 Smart Plant Monitor App

A React Native + Expo app for monitoring your plants with Bluetooth sensors.  
Includes plant management, statistics, and settings with temperature unit toggle.  

---

## 📸 Features
- Sign in / Sign up flow
- Dashboard with featured plant
- My Plants list (add, view, and track plants)
- Statistics per plant (temperature, moisture, humidity, light)
- Settings page (toggle °C/°F, notifications, dark mode placeholder)

---

## 📂 Project Structure
src/
assets/              # Local images (e.g. banana.png)
components/          # Reusable components
navigation/          # Tab + stack navigation setup
screens/             # App screens (Dashboard, MyPlants, Statistics, etc.)
state/               # Context + reducer for plants
types/               # TypeScript types

---

## ▶️ How to Run

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/smart-plant-monitor.git
cd smart-plant-monitor

2. Install dependencies
npm install

3. Start Metro bundler
npx expo start

4. Run on iOS :
npx expo run:ios

⚙️ Requirements
    •    Node.js ≥ 18
    •    Expo CLI
    •    iOS Simulator (Xcode) or Android Emulator (Android Studio)

⸻

🌿 Example Credentials

For demo purposes, sign in with any email + password.
(No backend auth yet — state is stored locally with AsyncStorage.)

⸻

👨‍💻 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you’d like to change.



