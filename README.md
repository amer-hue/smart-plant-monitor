# 🌱 Smart Plant Monitor App

A React Native + Expo app for monitoring your plants with Bluetooth sensors.  
Includes plant management, statistics, and settings with temperature unit toggle.

---

## 📸 Features

- Sign in / Sign up flow
- Dashboard with featured plant
- Bluetooth connection via BLE to hardware device
- My Plants list (add, view, and track plants)
- Statistics per plant (temperature, moisture, humidity, light)
- Settings page (toggle °C/°F, notifications, dark mode placeholder)

---

## 📂 Project Structure

src/
components/ # Reusable components
navigation/ # Tab + stack navigation setup
screens/ # App screens (Dashboard, MyPlants, Statistics, etc.)
state/ # Context + reducer for plants
types/ # TypeScript types

---

## ▶️ How to Run

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/smart-plant-monitor.git
cd smart-plant-monitor

2. Install dependencies
npm install

3. Download xcode desktop app

4. Connect ios device to computer via cable connection

5. Trust computer on iOS prompt

6. go to Devices in Xcode app

7. Ensure your device is visible

8. Open project in Xcode, click on "Targets" and navigate to Signing & Certificates tab

9. Create unique bundle identifier in this structure: com.XXXXX.plantmonitor9, replacing XXXXX with anything of your choice, as long as it is unique

10. Enable Developer Mode in iOS settings

11. Navigate to app.json file in an IDE

12. place your custom bundle identifier created in step 9 in the bundleIdentifier field under ios

13. While in root folder, run:
npx expo prebuild
npx expo run:ios --device
NOTE: device and computer must be on same network (non-school), can use hotspot



⚙️ Requirements
    •    Node.js ≥ 18
    •    Expo CLI
    •    iOS Developer mode enabled on device

⸻

```
