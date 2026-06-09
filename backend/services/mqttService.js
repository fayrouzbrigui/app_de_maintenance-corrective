const mqtt = require('mqtt');

const Lidar = require('../models/lidarModel');
const Camera = require('../models/cameraModel');
const Pc = require('../models/pcModel');
const GPS = require('../models/gpsModel');

const thresholds = require('../config/thresholds');
const { createNotification, shouldTrigger } = require('./notificationService');

const MQTT_BROKER = "mqtt://192.168.8.121:1883";

const client = mqtt.connect(MQTT_BROKER);

const LIDAR_TOPIC = 'robot/sensors/lidar';
const CAMERA_TOPIC = 'robot/sensors/camera';
const PC_TOPIC = 'robot/sensors/pc';
const GPS_TOPIC = 'robot/sensors/gps';

function initialize() {
    client.on('connect', () => {
        console.log('Connected to MQTT broker');

        client.subscribe([LIDAR_TOPIC, CAMERA_TOPIC, PC_TOPIC, GPS_TOPIC], (err) => {
            if (err) {
                console.error('Subscription error:', err);
            } else {
                console.log(`Subscribed to topics: ${LIDAR_TOPIC}, ${CAMERA_TOPIC}, ${PC_TOPIC}, ${GPS_TOPIC}`);
            }
        });
    });

    client.on("error", (err) => {
        console.error("MQTT Error:", err.message);
    });

    client.on("reconnect", () => {
        console.log("Reconnecting to MQTT broker...");
    });

    client.on("offline", () => {
        console.warn("MQTT offline");
    });

    client.on('message', async (topic, message) => {
        try {
            const data = JSON.parse(message.toString());

            if (topic === LIDAR_TOPIC) {
                if (!data.robotUuid ||
                    data.lastDistance === undefined ||
                    data.signalStrength === undefined ||
                    data.temperature === undefined ||
                    data.minDistance === undefined ||
                    data.maxDistance === undefined ||
                    data.averageDistance === undefined
                ) {
                    console.error('Incomplete Lidar data:', data);
                    return;
                }

                const newLidar = new Lidar({
                    robotUuid: data.robotUuid,
                    lastDistance: data.lastDistance,
                    signalStrength: data.signalStrength,
                    temperature: data.temperature,
                    minDistance: data.minDistance,
                    maxDistance: data.maxDistance,
                    averageDistance: data.averageDistance,
                    lastUpdate: new Date()
                });

                await newLidar.save();
                console.log('Saved Lidar data:', data);

                if (data.minDistance < thresholds.lidar.minDistance &&
                    shouldTrigger(`lidar_minDistance_${data.robotUuid}`)) {

                    await createNotification({
                        robotUuid: data.robotUuid,
                        type: 'LIDAR',
                        severity: 'high',
                        message: 'Obstacle too close',
                        data
                    });
                }

                if (data.signalStrength < thresholds.lidar.signalStrength &&
                    shouldTrigger(`lidar_signal_${data.robotUuid}`)) {

                    await createNotification({
                        robotUuid: data.robotUuid,
                        type: 'LIDAR',
                        severity: 'medium',
                        message: 'Weak signal',
                        data
                    });
                }

                if (data.temperature > thresholds.lidar.temperature &&
                    shouldTrigger(`lidar_temp_${data.robotUuid}`)) {

                    await createNotification({
                        robotUuid: data.robotUuid,
                        type: 'LIDAR',
                        severity: 'high',
                        message: 'Lidar overheating',
                        data
                    });
                }
            }

            else if (topic === CAMERA_TOPIC) {
                if (
                    !data.robotUuid ||
                    data.focus === undefined ||
                    data.brightness === undefined ||
                    data.contrast === undefined ||
                    data.noise === undefined ||
                    data.fps === undefined
                ) {
                    console.error('Incomplete Camera data:', data);
                    return;
                }

                const newCamera = new Camera({
                    robotUuid: data.robotUuid,
                    focus: data.focus,
                    brightness: data.brightness,
                    contrast: data.contrast,
                    noise: data.noise,
                    fps: data.fps,
                    lastUpdate: new Date()
                });

                const saved = await newCamera.save();
                console.log('Saved Camera data:', data);
                console.log('Camera saved successfully, ID:', saved._id);

                if (data.fps < thresholds.camera.fps &&
                    shouldTrigger(`camera_fps_${data.robotUuid}`)) {

                    await createNotification({
                        robotUuid: data.robotUuid,
                        type: 'CAMERA',
                        severity: 'medium',
                        message: 'Low FPS',
                        data
                    });
                }

                if (data.brightness < thresholds.camera.brightness &&
                    shouldTrigger(`camera_brightness_${data.robotUuid}`)) {

                    await createNotification({
                        robotUuid: data.robotUuid,
                        type: 'CAMERA',
                        severity: 'low',
                        message: 'Low brightness',
                        data
                    });
                }

                if (data.noise > thresholds.camera.noise &&
                    shouldTrigger(`camera_noise_${data.robotUuid}`)) {

                    await createNotification({
                        robotUuid: data.robotUuid,
                        type: 'CAMERA',
                        severity: 'medium',
                        message: 'High noise level',
                        data
                    });
                }
            }

            else if (topic === PC_TOPIC) {
                if (
                    !data.robotUuid ||
                    data.cpu_usage === undefined ||
                    data.cpu_temp === undefined ||
                    data.gpu_usage === undefined ||
                    data.gpu_temp === undefined
                ) {
                    console.log('Incomplete PC data:', data);
                    return;
                }

                const newPc = new Pc({
                    robotUuid: data.robotUuid,
                    cpu_usage: data.cpu_usage,
                    cpu_temp: data.cpu_temp,
                    gpu_usage: data.gpu_usage,
                    gpu_temp: data.gpu_temp,
                    lastUpdate: new Date()
                });

                await newPc.save();
                console.log('Saved PC data:', data);

                if (data.cpu_temp > thresholds.pc.cpu_temp &&
                    shouldTrigger(`cpu_temp_${data.robotUuid}`)) {

                    await createNotification({
                        robotUuid: data.robotUuid,
                        type: 'PC',
                        severity: 'high',
                        message: 'CPU overheating',
                        data
                    });
                }

                if (data.gpu_temp > thresholds.pc.gpu_temp &&
                    shouldTrigger(`gpu_temp_${data.robotUuid}`)) {

                    await createNotification({
                        robotUuid: data.robotUuid,
                        type: 'PC',
                        severity: 'high',
                        message: 'GPU overheating',
                        data
                    });
                }

                if (data.cpu_usage > thresholds.pc.cpu_usage &&
                    shouldTrigger(`cpu_usage_${data.robotUuid}`)) {

                    await createNotification({
                        robotUuid: data.robotUuid,
                        type: 'PC',
                        severity: 'medium',
                        message: 'High CPU usage',
                        data
                    });
                }
            }

            else if (topic === GPS_TOPIC) {
                if (
                    !data.robotUuid ||
                    data.latitude === undefined ||
                    data.longitude === undefined ||
                    data.num_satellites === undefined
                ) {
                    console.error('Incomplete GPS data:', data);
                    return;
                }

                const newGPS = new GPS({
                    robotUuid: data.robotUuid,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    num_satellites: data.num_satellites,
                    lastUpdate: new Date()
                });

                await newGPS.save();
                console.log('Saved GPS data:', data);

                if (data.num_satellites < thresholds.gps.num_satellites &&
                    shouldTrigger(`gps_signal_${data.robotUuid}`)) {

                    await createNotification({
                        robotUuid: data.robotUuid,
                        type: 'GPS',
                        severity: 'medium',
                        message: 'Weak GPS signal',
                        data
                    });
                }
            }

            else {
                console.warn('Unknown topic received:', topic);
            }

        } catch (error) {
            console.error('Error processing message:', error.message);
        }
    });
}

module.exports = { initialize, client };