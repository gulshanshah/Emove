const fs = require("fs");
const path = require("path");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mqtt = require("mqtt");

function loadEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
      (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnv();

const MQTT_URL = process.env.MQTT_URL;
const MQTT_USER = process.env.MQTT_USER;
const MQTT_PASS = process.env.MQTT_PASS;
const PORT = process.env.PORT || 3000;

if (!MQTT_URL || !MQTT_USER || !MQTT_PASS) {
  console.error(
    "Missing MQTT_URL, MQTT_USER or MQTT_PASS. Copy .env.example to .env and set your broker credentials."
  );
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

const mqttClient = mqtt.connect(MQTT_URL, { username: MQTT_USER, password: MQTT_PASS });

const hubSubscriptions = {};

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
});

mqttClient.on("message", (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    const hubId = topic.split("/")[1];
    io.to(hubId).emit("stateUpdate", data);
    console.log(`MQTT message from ${hubId}:`, data);
  } catch (e) {
    console.error("Invalid JSON:", e);
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinHub", (hubId) => {
    console.log(`Client ${socket.id} joined hub ${hubId}`);
    socket.join(hubId);

    if (!hubSubscriptions[hubId]) {
      mqttClient.subscribe(`utsav/${hubId}/state`, (err) => {
        if (err) console.error("MQTT subscribe error:", err);
        else {
          console.log(`Subscribed to MQTT topic for hub ${hubId}`);
          hubSubscriptions[hubId] = true;
        }
      });
    }
  });

  socket.on("toggleRelay", ({ hubId, relayNum, value }) => {
    const topic = `utsav/${hubId}/cmd`;
    const payload = `relay${relayNum}=${value}`;
    console.log(`Client ${socket.id} toggled relay${relayNum} of hub ${hubId} to ${value}`);
    mqttClient.publish(topic, payload, (err) => {
      if (err) console.error("MQTT publish error:", err);
      else console.log("Command sent:", payload);
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
