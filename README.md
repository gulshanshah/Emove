# Emove

Connecto is a DIY smart-home automation system built with ESP32, MQTT, Node.js, and React Native. It enables remote relay control through a mobile app, with real-time communication via Socket.IO, OTA firmware updates, and custom KiCad-designed PCBs.

## Repository layout

| Path | What it is |
| --- | --- |
| `myapp/` | React Native (0.78) app for Android and iOS |
| `server/` | Node.js bridge: MQTT ⇄ Socket.IO (Express + socket.io + mqtt) |
| `pcb/` | KiCad projects: `controller/` (main board) and `try/` (prototype) |

## Getting started

### Server

```bash
cd server
npm install
cp .env.example .env    # then fill in your broker credentials
npm start               # listens on http://localhost:3000
```

Configuration is read from `server/.env` (never committed): `MQTT_URL`, `MQTT_USER`, `MQTT_PASS`, optional `PORT`.

The bridge subscribes to `utsav/<hubId>/state` and publishes commands to `utsav/<hubId>/cmd` (payload format `relay<N>=<0|1>`).

### App

```bash
cd myapp
npm install
bundle install && bundle exec pod install   # iOS only
npx react-native run-android                # or run-ios
```

Point the app at your server by updating the `SERVER_URL` constants in the home screen components. Firmware provisioning connects to the device AP at `http://192.168.4.1`.

### PCB

Open `pcb/controller/controller.kicad_pro` with KiCad 8 or newer.

## Platform notes

- Android release signing currently falls back to the debug keystore; generate your own keystore before shipping.
- `google-services.json` and `debug.keystore` are intentionally not committed; add your own under `myapp/android/app/` before building.

## License

MIT — see [LICENSE](LICENSE).
