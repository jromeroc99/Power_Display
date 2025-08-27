require('dotenv').config();
const mqtt = require("mqtt");

// Cargar configuración desde variables de entorno.
const { MQTT_URL, MQTT_USERNAME, MQTT_PASSWORD } = process.env;


const client = mqtt.connect(MQTT_URL, {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD
});

const topicFase0 = "shellies/ipe/sotano/cuadro/emeter/0/power";
const topicFase1 = "shellies/ipe/sotano/cuadro/emeter/1/power";
const topicFase2 = "shellies/ipe/sotano/cuadro/emeter/2/power";

var valueFase0 = 0;
var valueFase1 = 0;
var valueFase2 = 0;

client.on("connect", () => {
  console.log("✅ Conectado al broker por WebSocket")
  // new line
  console.log(" ")
  // suscripciones 
  client.subscribe(topicFase0)
  client.subscribe(topicFase1)
  client.subscribe(topicFase2)
});

client.on("message", (topic, message) => {
    if (topic === topicFase0) {
        valueFase0 = message.toString();
    } else if (topic === topicFase1) {
        valueFase1 = message.toString();
    } else if (topic === topicFase2) {
        valueFase2 = message.toString();
    }

    console.log(`📊 Valores actuales: Fase 0: ${valueFase0} W, Fase 1: ${valueFase1} W, Fase 2: ${valueFase2} W`);

    //console.log(`📩 Mensaje en ${topic}: ${message.toString()}`);
});

client.on("error", (err) => {
  console.error("❌ Error:", err);
});