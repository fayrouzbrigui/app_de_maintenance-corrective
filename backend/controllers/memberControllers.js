const Image = require("../models/memberModel");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const mqtt = require("mqtt");

const MQTT_BROKER_URL = "mqtt://192.168.1.33";
const MQTT_TOPIC = "facenet/embeddings";

const generateFaceEmbedding = async (imagePath) => {
    const pythonVisiblePath = imagePath.replace(/\\/g, "/").replace("/public", "");
    const url = "http://localhost:5000/get_embedding";

    try {
        const res = await axios.post(url, { image_path: pythonVisiblePath });
        return res.data.embedding;
    } catch (error) {
        console.error(`Erreur appel Flask:`, error.message);
        if (error.response) {
            console.error("Réponse Flask:", error.response.status, error.response.data);
        }
        throw new Error("Erreur lors de la génération d'embedding");
    }
};

const trainModelOnEmbeddings = async (embeddingsData) => {
    try {
        const res = await axios.post("http://localhost:5000/train", { embeddings: embeddingsData });
        return res.data;
    } catch (err) {
        console.error("❌ Erreur entraînement du modèle:", err.response?.data || err.message);
        throw err;
    }
};

const mqttClient = mqtt.connect(MQTT_BROKER_URL);

mqttClient.on("connect", () => {
    console.log("🔌 Connecté au broker MQTT");
});

mqttClient.on("error", (err) => {
    console.error("Erreur MQTT:", err);
});

mqttClient.on("packetsend", (packet) => {
    if (packet.cmd === "publish" && packet.topic === MQTT_TOPIC) {
        console.log(`MQTT packet envoyé sur "${MQTT_TOPIC}"`);
    }
});

exports.uploadImage = async (req, res) => {
    try {
        const { name } = req.body;
        const { role } = req.user;

        if (role !== "superadmin") {
            return res.status(403).json({ message: "Only Superadmin can do that" });
        }

        const relativeImagePath = `/imageUploads/${req.file.filename}`;
        const absoluteImagePath = path.join(__dirname, `../public${relativeImagePath}`);
        const embeddingsData = [];

         const embedding = await generateFaceEmbedding(absoluteImagePath);

        const image = new Image({
            name,
            imagePath: relativeImagePath,
        });

        const saved = await image.save();

        embeddingsData.push({
            name: `${name}`,
            embedding,
        });

        const createdImages = [saved];

        const embeddingsDir = path.join(__dirname, "../embeddings");
        if (!fs.existsSync(embeddingsDir)) {
            fs.mkdirSync(embeddingsDir, { recursive: true });
        }

        const embeddingsFilePath = path.join(embeddingsDir, "embeddings_data.json");
        let existingEmbeddings = [];

        if (fs.existsSync(embeddingsFilePath)) {
            try {
                const rawData = fs.readFileSync(embeddingsFilePath, "utf-8");
                existingEmbeddings = JSON.parse(rawData);
            } catch (e) {
                console.error(" Erreur parsing JSON existant:", e);
            }
        }

        console.log(`${existingEmbeddings.length} embeddings existants, ${embeddingsData.length} nouveaux`);

        // Fusion & suppression de doublons
        const combined = [...existingEmbeddings, ...embeddingsData];
        const uniqueMap = new Map();
        combined.forEach((item) => {
            uniqueMap.set(item.name, item);
        });
        const uniqueEmbeddings = Array.from(uniqueMap.values());

        console.log(`Total unique embeddings à sauvegarder: ${uniqueEmbeddings.length}`);

        fs.writeFileSync(embeddingsFilePath, JSON.stringify(uniqueEmbeddings, null, 2), "utf-8");

        const stats = fs.statSync(embeddingsFilePath);
        console.log(`Fichier embeddings_data.json sauvegardé (${stats.size} octets)`);

        const jsonBuffer = fs.readFileSync(embeddingsFilePath);
        console.log(`Taille JSON à publier: ${jsonBuffer.length} octets`);
        console.log("Extrait JSON (début):", jsonBuffer.toString("utf8").slice(0, 300) + "...");
        console.log(" Extrait JSON (fin):", jsonBuffer.toString("utf8").slice(-300));

        mqttClient.publish(MQTT_TOPIC, jsonBuffer, { qos: 1 }, (err) => {
            if (err) {
                console.error("Erreur envoi MQTT:", err);
            } else {
                console.log(`Embeddings (taille ${jsonBuffer.length} octets) envoyés via MQTT sur le topic "${MQTT_TOPIC}"`);
            }
        });

        await trainModelOnEmbeddings(uniqueEmbeddings);

        res.status(201).json({
            message: "Image, embeddings et modèle mis à jour.",
            images: createdImages,
        });
    } catch (error) {
        console.error("Erreur serveur:", error);
        mqttClient.end(true);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.getImages = async (req, res) => {
    try {
        const { role } = req.user;

        if (role !== "superadmin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const images = await Image.find().sort({ createdAt: -1 });

        res.status(200).json(images);
    } catch (error) {
        console.error("❌ getImages error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getImage = async (req, res) => {
    try {
        const { role } = req.user;

        if (role !== "superadmin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const image = await Image.findById(req.params.id);

        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        res.status(200).json(image);
    } catch (error) {
        console.error("getImage error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const { role } = req.user;

        if (role !== "superadmin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const image = await Image.findById(req.params.id);

        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        const filePath = path.join(
            __dirname,
            `../public${image.imagePath}`
        );

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await image.deleteOne();

        res.status(200).json({
            message: "Image deleted successfully",
        });
    } catch (error) {
        console.error(" deleteImage error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
