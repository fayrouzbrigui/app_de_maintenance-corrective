const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const mqtt = require("mqtt");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const memberRoutes = require("./routes/memberRoutes");
const robotRoutes = require("./routes/robotRoutes");
const lidarRoutes = require("./routes/lidarRoutes");
const cameraRoutes = require("./routes/cameraRoutes");
const pcRoutes = require("./routes/pcRoutes");
const commandRoutes = require("./routes/commandRoutes");
const gpsRoutes = require("./routes/gpsRoutes");
const notifRoutes = require("./routes/notificationRoutes");
const plateRoutes = require("./routes/plateRoues");
const reportRoutes = require("./routes/reportRoutes");
const { initialize: initializeMQTT } = require("./services/mqttService");
const User = require("./models/userModel");
const Robot = require("./models/robotModel");


dotenv.config();
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "OK" : "MISSING");

const app = express();
const AUDIO_DIR = path.join(__dirname, "audio_uploads");
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR);
}
console.log("Audio directory path:", AUDIO_DIR);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/imageUploads', express.static(path.join(__dirname, 'imageUploads')));
app.use("/audio_uploads", express.static(AUDIO_DIR));

const MQTT_BROKER = process.env.MQTT_BROKER || "mqtt://192.168.1.33";
const mqttClient = mqtt.connect(MQTT_BROKER);
console.log(`Connecting to MQTT broker at: ${MQTT_BROKER}`);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL.split(","),
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  transports: ['websocket'],
});

app.use(cors({
  origin: process.env.CLIENT_URL.split(","),
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(bodyParser.json());
app.use("/usersApi", userRoutes);
app.use("/membersApi", memberRoutes);
app.use("/robotsApi", robotRoutes);
app.use("/lidarsApi", lidarRoutes);
app.use("/cameraApi", cameraRoutes);
app.use("/pcApi", pcRoutes);
app.use("/cmdApi", commandRoutes);
app.use("/gpsApi", gpsRoutes);
app.use("/notifApi", notifRoutes);
app.use("/plateApi", plateRoutes);
app.use("/reportApi", reportRoutes);


const DB = process.env.DATABASE.replace("<db_password>", process.env.DATABASE_PASSWORD);
mongoose.connect(DB)
  .then(() => {
      console.log("DB connection secured !!!!");
      console.log("Connected to database:", mongoose.connection.name);   // ← Add this
      console.log("Connection host:", mongoose.connection.host);

  })
  .catch(err => console.error("MongoDB connection failed:", err));

app.use((err, req, res, next) => {
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

initializeMQTT();

const authenticatedSockets = new Map();

io.use(async (socket, next) => {
  try {
    const authHeader = socket.handshake.headers['authorization'] || 
                      (socket.handshake.auth && socket.handshake.auth.token);
    
    let token;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (authHeader) {
      token = authHeader;
    }

    if (!token) {
      console.warn("Socket: Missing auth token");
      return next(new Error("Authentication token missing"));
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      console.warn("Socket: User not found for token");
      return next(new Error("User not found"));
    }

    socket.user = user;

    const userId = user._id.toString();
    const sockets = authenticatedSockets.get(userId) || [];
    sockets.push(socket);
    authenticatedSockets.set(userId, sockets);

    console.log(`Socket authenticated for user ${userId}, socket ID: ${socket.id}`);
    next();
  } catch (err) {
    console.error("Socket auth error:", err);
    next(new Error("Authentication failed"));
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
    const userId = socket.user?._id?.toString();
    if (userId && authenticatedSockets.has(userId)) {
      const sockets = authenticatedSockets.get(userId).filter(s => s.id !== socket.id);
      sockets.length ? authenticatedSockets.set(userId, sockets) : authenticatedSockets.delete(userId);
    }
  });
});

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe("alert/#", (err) => {
    if (err) console.error("MQTT Subscribe Error:", err);
    else console.log("Subscribed to alert/#");
  });
});

mqttClient.on("error", (err) => console.error("MQTT Error:", err.message));
mqttClient.on("reconnect", () => console.log("Reconnecting to MQTT broker..."));
mqttClient.on("offline", () => console.warn("MQTT offline"));

mqttClient.on("message", async (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    const { uuid, mp3_file, filename } = payload;

    if (!uuid|| !mp3_file || !filename) {
      console.warn("MQTT: Incomplete payload", payload);
      return;
    }

    const robot = await Robot.findOne({ uuid });
    if (!robot) {
      console.warn(`MQTT: No robot found with uuid_rasp ${uuid}`);
      return;
    }


    const userId = user._id.toString();
    const sockets = authenticatedSockets.get(userId);

    if (!sockets?.length) {
      console.warn(`[MQTT] No connected socket found for user: ${userId}`);
      return;
    }

    // Step 4: Save the MP3 file
    const safeFilename = path.basename(filename);
    const uniqueFilename = `${uuid}_${Date.now()}_${safeFilename}`;
    const filePath = path.join(AUDIO_DIR, uniqueFilename);
    const audioBuffer = Buffer.from(mp3_file, "base64");

    if (!audioBuffer.length) {
      console.warn(`[MQTT] Empty file: ${uniqueFilename}`);
      return;
    }

    fs.writeFile(filePath, audioBuffer, (err) => {
      if (err) {
        console.error("File save error:", err);
        return;
      }

      console.log(`[MQTT] File saved: ${uniqueFilename}`);

      const baseUrl = process.env.SERVER_URL || "http://192.168.1.12:5001";
      const audioUrl = `${baseUrl}/audio_uploads/${uniqueFilename}`;

      // Step 5: Emit event to user's connected sockets
      for (const socket of sockets) {
        socket.emit("alert", {
          deviceId: uuid,
          audioUrl,
          timestamp: new Date().toISOString(),
          message: "unknown persen detected"
        });
      }
    });

  } catch (err) {
    console.error("MQTT handler error:", err);
  }
});



const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

