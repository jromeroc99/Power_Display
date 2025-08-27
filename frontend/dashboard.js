
var valueFase0 = 0;
var valueFase1 = 0;
var valueFase2 = 0;

// Configuración del cliente WebSocket para conectarse al backend
const BACKEND_URL = 'http://localhost:3000';
const socket = io(BACKEND_URL);

// Variables para la gráfica
let powerChart = null;
let chartData = {
    labels: [],
    datasets: [
        {
            label: 'Fase 1',
            data: [],
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4,
            fill: false
        },
        {
            label: 'Fase 2',
            data: [],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            tension: 0.4,
            fill: false
        },
        {
            label: 'Fase 3',
            data: [],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            tension: 0.4,
            fill: false
        }
    ]
};

// Función para inicializar la gráfica
function initChart() {
    const ctx = document.getElementById('powerChart').getContext('2d');
    powerChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Potencia (W)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tiempo',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            const label = context.dataset.label;
                            if (value < 0) {
                                return `${label}: ${Math.abs(value)} W (Generación Solar)`;
                            } else {
                                return `${label}: ${value} W (Consumo)`;
                            }
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Función para formatear potencia con indicador de tipo
function formatPower(value, elementId, indicatorId) {
    const element = document.getElementById(elementId);
    const indicator = document.getElementById(indicatorId);
    
    if (value < 0) {
        // Potencia negativa = Generación solar
        element.textContent = `${Math.abs(value).toFixed(1)} W`;
        element.classList.add('solar-power');
        element.classList.remove('consumption-power');
        
        if (indicator) {
            indicator.className = 'power-indicator solar';
        }
        
        return Math.abs(value);
    } else {
        // Potencia positiva = Consumo
        element.textContent = `${value.toFixed(1)} W`;
        element.classList.add('consumption-power');
        element.classList.remove('solar-power');
        
        if (indicator) {
            indicator.className = 'power-indicator consumption';
        }
        
        return value;
    }
}

// Función para actualizar estadísticas generales
function updateStats() {
    const total = valueFase0 + valueFase1 + valueFase2;
    const totalElement = document.getElementById('total-power');
    const powerTypeElement = document.getElementById('power-type');
    const solarPowerElement = document.getElementById('solar-power');
    const houseConsumptionElement = document.getElementById('house-consumption');
    const co2SavedElement = document.getElementById('co2-saved');
    
    // Actualizar potencia total
    if (total < 0) {
        totalElement.textContent = `${Math.abs(total).toFixed(1)} W`;
        totalElement.style.color = '#22c55e';
        powerTypeElement.innerHTML = '<i class="fas fa-solar-panel"></i> Generación Solar';
        powerTypeElement.className = 'power-type solar';
    } else {
        totalElement.textContent = `${total.toFixed(1)} W`;
        totalElement.style.color = '#ef4444';
        powerTypeElement.innerHTML = '<i class="fas fa-plug"></i> Consumo';
        powerTypeElement.className = 'power-type consumption';
    }
    
    // Calcular energía solar generada
    const solarGenerated = Math.abs(Math.min(0, valueFase0, valueFase1, valueFase2)) * 3;
    solarPowerElement.textContent = `${solarGenerated.toFixed(1)} W`;
    
    // Calcular consumo de la casa
    const houseConsumption = Math.max(0, total);
    houseConsumptionElement.textContent = `${houseConsumption.toFixed(1)} W`;
    
    // Calcular CO2 ahorrado (aproximado: 1kWh = 0.4kg CO2)
    const co2Saved = (solarGenerated / 1000) * 0.4;
    co2SavedElement.textContent = `${co2Saved.toFixed(2)} kg/h`;
}

// Función para actualizar la gráfica
function updateChart() {
    const now = new Date();
    const timeLabel = now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    
    // Añadir nuevo punto de datos
    chartData.labels.push(timeLabel);
    chartData.datasets[0].data.push(valueFase0);
    chartData.datasets[1].data.push(valueFase1);
    chartData.datasets[2].data.push(valueFase2);
    
    // Mantener solo los últimos 20 puntos
    if (chartData.labels.length > 20) {
        chartData.labels.shift();
        chartData.datasets[0].data.shift();
        chartData.datasets[1].data.shift();
        chartData.datasets[2].data.shift();
    }
    
    // Actualizar gráfica
    if (powerChart) {
        powerChart.update('none');
    }
}

// Inicializar gráfica cuando la página esté lista
document.addEventListener('DOMContentLoaded', function() {
    initChart();
});

// Configuración de eventos del cliente WebSocket
socket.on("connect", () => {
    console.log("✅ Conectado al backend por WebSocket");
    console.log(" ");
    
    // Actualizar indicador de conexión
    const statusElement = document.getElementById('connection-status');
    statusElement.textContent = 'Conectado';
    statusElement.classList.add('connected');
});

// Configuración de eventos del cliente WebSocket
socket.on("connect", () => {
    console.log("✅ Conectado al backend por WebSocket");
    console.log(" ");
    
    // Actualizar indicador de conexión
    const statusElement = document.getElementById('connection-status');
    statusElement.innerHTML = '<i class="fas fa-wifi"></i> Conectado';
    statusElement.classList.add('connected');
});

socket.on("powerData", (data) => {
    // Recibir datos del backend con formato { fase0, fase1, fase2 }
    let dataChanged = false;
    
    if (data.fase0 !== undefined) {
        valueFase0 = parseFloat(data.fase0);
        formatPower(valueFase0, 'fase0', 'indicator-0');
        dataChanged = true;
    }
    if (data.fase1 !== undefined) {
        valueFase1 = parseFloat(data.fase1);
        formatPower(valueFase1, 'fase1', 'indicator-1');
        dataChanged = true;
    }
    if (data.fase2 !== undefined) {
        valueFase2 = parseFloat(data.fase2);
        formatPower(valueFase2, 'fase2', 'indicator-2');
        dataChanged = true;
    }
    
    if (dataChanged) {
        updateStats();
        updateChart();
    }
    
    console.log(`📊 Valores actuales: Fase 1: ${valueFase0} W, Fase 2: ${valueFase1} W, Fase 3: ${valueFase2} W`);
});

socket.on("disconnect", () => {
    console.log("🔌 Conexión cerrada");
    const statusElement = document.getElementById('connection-status');
    statusElement.innerHTML = '<i class="fas fa-wifi-slash"></i> Desconectado';
    statusElement.classList.remove('connected');
});

socket.on("connect_error", (error) => {
    console.error("❌ Error de conexión:", error);
    const statusElement = document.getElementById('connection-status');
    statusElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error de conexión';
    statusElement.classList.remove('connected');
});

socket.on("reconnect", () => {
    console.log("🔄 Reconectando...");
    const statusElement = document.getElementById('connection-status');
    statusElement.innerHTML = '<i class="fas fa-sync fa-spin"></i> Reconectando...';
    statusElement.classList.remove('connected');
});