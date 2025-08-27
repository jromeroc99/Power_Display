require('dotenv').config();
const mqtt = require("mqtt");
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

// Configuración del servidor Express
const app = express();
const server = http.createServer(app);

// Configuración de Socket.IO con CORS
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));

// Cargar configuración desde variables de entorno
const { MQTT_URL, MQTT_USERNAME, MQTT_PASSWORD } = process.env;

// Configuración MQTT
const client = mqtt.connect(MQTT_URL, {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    keepalive: 20,
    reconnectPeriod: 1000
});

const topicFase0 = "shellies/ipe/sotano/cuadro/emeter/0/power";
const topicFase1 = "shellies/ipe/sotano/cuadro/emeter/1/power";
const topicFase2 = "shellies/ipe/sotano/cuadro/emeter/2/power";

let powerData = {
    fase0: 0,
    fase1: 0,
    fase2: 0
};

// Eventos MQTT
client.on("connect", () => {
    // console.log("Backend conectado al broker MQTT");
    // console.log(" ");
    
    // Suscripciones
    client.subscribe(topicFase0);
    client.subscribe(topicFase1);
    client.subscribe(topicFase2);
});

client.on("message", (topic, message) => {
    const messageStr = message.toString();
    let updatedData = {};
    
    if (topic === topicFase0) {
        powerData.fase0 = parseFloat(messageStr);
        updatedData.fase0 = powerData.fase0;
    } else if (topic === topicFase1) {
        powerData.fase1 = parseFloat(messageStr);
        updatedData.fase1 = powerData.fase1;
    } else if (topic === topicFase2) {
        powerData.fase2 = parseFloat(messageStr);
        updatedData.fase2 = powerData.fase2;
    }

    // console.log(`Valores actuales: Fase 0: ${powerData.fase0} W, Fase 1: ${powerData.fase1} W, Fase 2: ${powerData.fase2} W`);
    
    // Enviar datos a todos los clientes WebSocket conectados
    io.emit('powerData', updatedData);
});

client.on("error", (err) => {
    // console.error("Error MQTT:", err);
});

client.on("close", () => {
    // console.log("Conexión MQTT cerrada");
});

client.on("reconnect", () => {
    // console.log("Reconectando a MQTT...");
});

// Eventos Socket.IO
io.on('connection', (socket) => {
    // console.log(`Cliente conectado: ${socket.id}`);
    
    // Enviar datos actuales al cliente recién conectado
    socket.emit('powerData', powerData);
    
    socket.on('disconnect', () => {
        // console.log(`Cliente desconectado: ${socket.id}`);
    });
});

// Ruta principal para servir el frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    // console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

// Manejo de errores del servidor
process.on('SIGINT', () => {
    // console.log('\nCerrando servidor...');
    client.end();
    server.close(() => {
        // console.log('Servidor cerrado correctamente');
        process.exit(0);
    });
});
