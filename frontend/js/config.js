/**
 * Configuración y constantes de la aplicación
 */

// Configuración del backend
export const CONFIG = {
    BACKEND_URL: 'http://ryzen:3000',
    MAX_CHART_POINTS: 20,
    PHASES: ['Fase 0', 'Fase 1', 'Fase 2']
};

// Datos de los aparatos por fase
export const APPLIANCES_DATA = {
    "Fase 0": [
        {"aparato": "Horno", "consumo": [2000]},
        {"aparato": "Vitro", "consumo": [1000, 2000]},
        {"aparato": "Lavavajillas", "consumo": [1100]},
        {"aparato": "Frigorífico", "consumo": [10, 40, 140]},
        {"aparato": "Portátil", "consumo": [30, 60]},
        {"aparato": "NAS", "consumo": [50]},
        {"aparato": "Luz escalera", "consumo": [20]},
        {"aparato": "Luz cocina", "consumo": [50]}
    ],
    "Fase 1": [
        {"aparato": "Lavadora", "consumo": [1000]},
        {"aparato": "Aire Acondicionado", "consumo": [20]}
    ],
    "Fase 2": [
        {"aparato": "Neveras abajo", "consumo": [150]},
        {"aparato": "Microondas", "consumo": [400]},
        {"aparato": "Tostadora", "consumo": [1000]},
        {"aparato": "Cafetera", "consumo": [1500]},
        {"aparato": "Panificadora", "consumo": [700, 1000]},
        {"aparato": "Ordenadores fijos", "consumo": [300]}
    ]
};

// Configuración de la gráfica
export const CHART_CONFIG = {
    colors: {
        phase0: '#22c55e',
        phase1: '#2563eb',
        phase2: '#f59e0b'
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: { size: 11 },
                    padding: 10
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                titleFont: { size: 12 },
                bodyFont: { size: 11 },
                callbacks: {
                    label: function(context) {
                        const value = context.parsed.y;
                        const label = context.dataset.label;
                        if (value < 0) {
                            return `${label}: ${Math.abs(value)} W ☀️ Generación Solar`;
                        } else if (value > 0) {
                            return `${label}: ${value} W 🏠 Consumo Vivienda`;
                        } else {
                            return `${label}: 0 W (Sin actividad)`;
                        }
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Potencia (W)',
                    font: { size: 11, weight: 'bold' }
                },
                ticks: { 
                    font: { size: 10 },
                    callback: function(value) {
                        if (value < 0) {
                            return `${Math.abs(value)}W ☀️`;
                        } else if (value > 0) {
                            return `${value}W 🏠`;
                        } else {
                            return '0W';
                        }
                    }
                },
                grid: { 
                    color: function(context) {
                        if (context.tick.value === 0) {
                            return 'rgba(0, 0, 0, 0.3)'; // Línea más visible en el 0
                        }
                        return 'rgba(0, 0, 0, 0.05)';
                    }
                }
            },
            x: {
                title: { display: false },
                ticks: { font: { size: 10 }, maxTicksLimit: 6 },
                grid: { color: 'rgba(0, 0, 0, 0.05)' }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    }
};

// Estados de aparatos
export const APPLIANCE_STATES = {
    NO_SOLAR: 'no-solar',
    PARTIAL_SOLAR: 'partial-solar',
    FULL_SOLAR: 'full-solar'
};

// Selectores DOM comunes
export const SELECTORS = {
    connectionStatus: '#connection-status',
    powerChart: '#powerChart',
    appliancesGrid: '#appliances-grid',
    availableSolarPower: '#available-solar-power',
    selectorButtons: '.selector-btn',
    mainContent: '.main-content'
};
