
var valueFase0 = 0;
var valueFase1 = 0;
var valueFase2 = 0;

// Configuración del cliente WebSocket para conectarse al backend
const BACKEND_URL = 'http://localhost:3000';
const socket = io(BACKEND_URL);

// Configuración de eventos del cliente WebSocket
socket.on("connect", () => {
    console.log("✅ Conectado al backend por WebSocket");
    console.log(" ");
    
    // Actualizar indicador de conexión
    const statusElement = document.getElementById('connection-status');
    statusElement.textContent = 'Conectado';
    statusElement.classList.add('connected');
});

socket.on("powerData", (data) => {
    // Recibir datos del backend con formato { fase0, fase1, fase2 }
    if (data.fase0 !== undefined) {
        valueFase0 = data.fase0;
        document.getElementById('fase0').textContent = valueFase0 + ' W';
    }
    if (data.fase1 !== undefined) {
        valueFase1 = data.fase1;
        document.getElementById('fase1').textContent = valueFase1 + ' W';
    }
    if (data.fase2 !== undefined) {
        valueFase2 = data.fase2;
        document.getElementById('fase2').textContent = valueFase2 + ' W';
    }
    
    console.log(`📊 Valores actuales: Fase 0: ${valueFase0} W, Fase 1: ${valueFase1} W, Fase 2: ${valueFase2} W`);
});

socket.on("disconnect", () => {
    console.log("🔌 Conexión cerrada");
    const statusElement = document.getElementById('connection-status');
    statusElement.textContent = 'Desconectado';
    statusElement.classList.remove('connected');
});

socket.on("connect_error", (error) => {
    console.error("❌ Error de conexión:", error);
    const statusElement = document.getElementById('connection-status');
    statusElement.textContent = 'Error de conexión';
    statusElement.classList.remove('connected');
});

socket.on("reconnect", () => {
    console.log("🔄 Reconectando...");
    const statusElement = document.getElementById('connection-status');
    statusElement.textContent = 'Reconectando...';
    statusElement.classList.remove('connected');
});