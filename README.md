# ITML HR Automation App

React Native (Expo) client + Express/MongoDB backend for automating HR requests (employees submit requests, managers/HR approve, calendar of approved leaves).

## Project layout
- `itmlApp/` – Expo mobile app
- `ItmlServer/` – Express API + MongoDB seed data

## Prerequisites
- Node.js 18+ and npm
- MongoDB running locally (or Docker Desktop)
- Android Studio with Android SDK and an emulator (API 33+ recommended)
- Optional for builds: Expo CLI (`npm i -g expo`) and EAS CLI (`npm i -g eas-cli`, Expo account needed for cloud builds)

## 1) Backend (Express + MongoDB)
1) `cd ItmlServer`
2) Install dependencies: `npm install`
3) Create `ItmlServer/.env`:
```
MONGO_URI=mongodb://localhost:27017/itml
PORT=5000
```
   - If using Docker Compose, set `MONGO_URI=mongodb://mongo:27017/itml`.
4) Run MongoDB
   - Local MongoDB service, or
   - Docker: `docker compose up -d`
5) Start the API: `npm run dev` (nodemon) or `npm start`  
   The server listens on `http://0.0.0.0:5000`.

## 2) Run the app on the Android Studio emulator
1) Launch Android Studio → Device Manager → create/start an emulator.
2) `cd itmlApp && npm install`
3) Ensure the backend is running on port 5000.
4) With the emulator booted, start Expo: `npm run android` (or `npx expo start --android`). Expo opens the app in the emulator automatically.
5) API base URL is hard-coded to `http://10.0.2.2:5000` (Android emulator loopback). For a physical device or a different host, replace `10.0.2.2` in the client code (`itmlApp/` search for `10.0.2.2`) with your machine’s LAN IP.

## Optional: build an installable APK with EAS
- Cloud build (simplest):
```
cd itmlApp
npm install
npm i -g eas-cli
eas login
eas build -p android --profile preview
```
Uses the `preview` profile in `eas.json` and returns a downloadable `.apk` from EAS.

- Local build (no EAS cloud; uses your Android SDK/Java):
```
cd itmlApp
npm i -g eas-cli
eas build -p android --profile preview --local
```
Outputs an `.apk` under `itmlApp/build/` that you can sideload. Before building for a real device, update the API URLs to point at an address reachable from the device (not `10.0.2.2`).

## Tips
- If the emulator cannot find the Metro dev server, press `a` in the Expo terminal or pick “Run on Android device/emulator” in Expo Dev Tools.
- Clear Expo cache if bundling misbehaves: `npx expo start -c`.
- You can also run `npm run web` for quick UI checks; API calls still expect the backend.
