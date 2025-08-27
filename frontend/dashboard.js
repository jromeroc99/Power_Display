
var valueFase0 = 0;
var valueFase1 = 0;
var valueFase2 = 0;

// Datos de los aparatos por fase (solo los que tienen valores de consumo)
const appliances = {
    "Fase 0": [
        {"aparato": "Horno", "consumo": [2000]},
        {"aparato": "Vitro", "consumo": [1000, 2000]},
        {"aparato": "Lavavajillas", "consumo": [1100]},
        {"aparato": "Tv Juegos", "consumo": [100]},
        {"aparato": "Frigorífico", "consumo": [10, 40, 140]},
        {"aparato": "Portátil", "consumo": [30, 60]},
        {"aparato": "NAS+Router+Chromecast", "consumo": [50]},
        {"aparato": "Luz escalera", "consumo": [20]},
        {"aparato": "Luz cocina", "consumo": [50]}
    ],
    "Fase 1": [
        {"aparato": "Lavadora", "consumo": [1000]},
        {"aparato": "Aire Acondicionado", "consumo": [20]},
        {"aparato": "Cuartos de baño", "consumo": [1500]}
    ],
    "Fase 2": [
        {"aparato": "Neveras abajo", "consumo": [150]},
        {"aparato": "Microondas", "consumo": [400]},
        {"aparato": "Tostadora", "consumo": [1000]},
        {"aparato": "Cafetera", "consumo": [1500]},
        {"aparato": "Panificadora", "consumo": [700, 1000]},
        {"aparato": "Ordenadores niños", "consumo": [300]}
    ]
};

// Configuración del cliente WebSocket para conectarse al backend
const BACKEND_URL = 'http://ryzen:3000';
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
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 11
                        },
                        padding: 10
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    titleFont: {
                        size: 12
                    },
                    bodyFont: {
                        size: 11
                    },
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            const label = context.dataset.label;
                            if (value < 0) {
                                return `${label}: ${Math.abs(value)} W (Solar)`;
                            } else {
                                return `${label}: ${value} W (Consumo)`;
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'W',
                        font: {
                            size: 11,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    title: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 10
                        },
                        maxTicksLimit: 6
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
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

// Función para formatear potencia con indicador de tipo y mensaje
function formatPower(value, elementId, indicatorId) {
    const element = document.getElementById(elementId);
    const indicator = document.getElementById(indicatorId);
    const phaseIndex = elementId.replace('fase', '');
    const statusElement = document.getElementById(`status-${phaseIndex}`);
    const phaseCard = document.querySelector(`[data-phase="${phaseIndex}"]`);
    
    if (value < 0) {
        // Potencia negativa = Generación solar
        element.textContent = `${Math.abs(value).toFixed(1)} W`;
        element.classList.add('solar-power');
        element.classList.remove('consumption-power');
        
        if (indicator) {
            indicator.className = 'power-indicator solar';
        }
        
        if (statusElement) {
            statusElement.textContent = '🌞 Generación Solar';
            statusElement.className = 'phase-status solar';
        }
        
        if (phaseCard) {
            phaseCard.classList.add('solar-active');
            phaseCard.classList.remove('consumption-active');
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
        
        if (statusElement) {
            statusElement.textContent = '🏠 Consumo de Vivienda';
            statusElement.className = 'phase-status consumption';
        }
        
        if (phaseCard) {
            phaseCard.classList.add('consumption-active');
            phaseCard.classList.remove('solar-active');
        }
        
        return value;
    }
}

// Función para actualizar análisis de aparatos solares
function updateStats() {
    // Solo actualizar análisis de aparatos solares
    updateSolarAppliances();
}

// Función para inicializar la visualización de aparatos
function initAppliances() {
    const appliancesGrid = document.getElementById('appliances-grid');
    appliancesGrid.innerHTML = '';
    
    Object.keys(appliances).forEach((phase, phaseIndex) => {
        appliances[phase].forEach(appliance => {
            const card = createApplianceCard(appliance, phase, phaseIndex);
            appliancesGrid.appendChild(card);
        });
    });
}

// Función para crear una tarjeta de aparato compacta
function createApplianceCard(appliance, phase, phaseIndex) {
    const card = document.createElement('div');
    card.className = 'appliance-card';
    card.setAttribute('data-phase', phaseIndex);
    card.setAttribute('data-appliance', appliance.aparato);
    
    const consumptionText = appliance.consumo.length > 1 
        ? `${Math.min(...appliance.consumo)}-${Math.max(...appliance.consumo)} W`
        : `${appliance.consumo[0]} W`;
    
    card.innerHTML = `
        <div class="appliance-header">
            <div class="appliance-name">${appliance.aparato}</div>
            <div class="appliance-phase">${phase}</div>
        </div>
        <div class="appliance-consumption">${consumptionText}</div>
        <div class="appliance-status">
            <div class="status-icon"></div>
            <div class="status-text">Calculando...</div>
        </div>
    `;
    
    return card;
}

// Función para actualizar el análisis de aparatos solares
function updateSolarAppliances() {
    // Calcular energía solar disponible por fase (solo si la fase tiene valores negativos)
    const solarByPhase = [
        valueFase0 < 0 ? Math.abs(valueFase0) : 0, // Fase 0
        valueFase1 < 0 ? Math.abs(valueFase1) : 0, // Fase 1
        valueFase2 < 0 ? Math.abs(valueFase2) : 0  // Fase 2
    ];
    
    const totalSolarAvailable = solarByPhase.reduce((sum, power) => sum + power, 0);
    
    // Actualizar el indicador de energía solar disponible (solo informativo)
    const availableSolarElement = document.getElementById('available-solar-power');
    if (availableSolarElement) {
        availableSolarElement.textContent = `${totalSolarAvailable.toFixed(1)} W`;
    }
    
    // Analizar cada aparato - cada fase es independiente
    Object.keys(appliances).forEach((phase, phaseIndex) => {
        appliances[phase].forEach(appliance => {
            updateApplianceStatus(appliance, phaseIndex, solarByPhase[phaseIndex]);
        });
    });
}

// Función para actualizar el estado de un aparato específico
function updateApplianceStatus(appliance, phaseIndex, phaseSolarPower) {
    const card = document.querySelector(`[data-appliance="${appliance.aparato}"]`);
    if (!card) return;
    
    const statusIcon = card.querySelector('.status-icon');
    const statusText = card.querySelector('.status-text');
    
    // Obtener el consumo mínimo y máximo del aparato
    const minConsumption = Math.min(...appliance.consumo);
    const maxConsumption = Math.max(...appliance.consumo);
    
    let status, statusClass, iconClass, textClass;
    
    // Verificar el estado de la fase para este aparato
    if (phaseSolarPower === 0) {
        // Nivel 3: La fase está consumiendo energía, no hay energía solar disponible
        status = `Pagando consumo de red`;
        statusClass = 'no-solar';
        iconClass = 'red';
        textClass = 'no-solar';
    } else if (phaseSolarPower >= maxConsumption) {
        // Nivel 1: Hay energía solar suficiente para todo el consumo del aparato
        status = `Funciona GRATIS con solar`;
        statusClass = 'full-solar';
        iconClass = 'green';
        textClass = 'full-solar';
    } else {
        // Nivel 2: Hay energía solar, pero no suficiente para el consumo completo
        status = `Ahorrando con energía solar`;
        statusClass = 'partial-solar';
        iconClass = 'yellow';
        textClass = 'partial-solar';
    }
    
    // Actualizar la UI
    card.className = `appliance-card ${statusClass}`;
    statusIcon.className = `status-icon ${iconClass}`;
    statusText.className = `status-text ${textClass}`;
    statusText.textContent = status;
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
    initAppliances();
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