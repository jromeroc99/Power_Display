/**
 * Gestión de la gráfica en tiempo real
 */

import { CONFIG, CHART_CONFIG } from './config.js';

export class ChartManager {
    constructor() {
        this.chart = null;
        this.phaseColors = ['#3B82F6', '#8B5CF6', '#F59E0B']; // Azul, Morado, Naranja
        
        this.data = {
            labels: [],
            datasets: [
                {
                    label: 'Fase 0',
                    data: [],
                    borderColor: this.phaseColors[0], // Azul
                    backgroundColor: 'transparent',
                    pointBackgroundColor: this.phaseColors[0],
                    pointBorderColor: this.phaseColors[0],
                    tension: 0.4,
                    fill: false,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderWidth: 2
                },
                {
                    label: 'Fase 1',
                    data: [],
                    borderColor: this.phaseColors[1], // Morado
                    backgroundColor: 'transparent',
                    pointBackgroundColor: this.phaseColors[1],
                    pointBorderColor: this.phaseColors[1],
                    tension: 0.4,
                    fill: false,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderWidth: 2
                },
                {
                    label: 'Fase 2',
                    data: [],
                    borderColor: this.phaseColors[2], // Naranja
                    backgroundColor: 'transparent',
                    pointBackgroundColor: this.phaseColors[2],
                    pointBorderColor: this.phaseColors[2],
                    tension: 0.4,
                    fill: false,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderWidth: 2
                }
            ]
        };
    }

    /**
     * Inicializa la gráfica
     */
    init() {
        const ctx = document.getElementById('powerChart');
        if (!ctx) {
            console.error('❌ No se encontró el elemento canvas para la gráfica');
            return;
        }

        this.chart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: this.data,
            options: CHART_CONFIG.options
        });

        console.log('📊 Gráfica inicializada correctamente');
    }

    /**
     * Actualiza la gráfica con nuevos valores
     * @param {Array} values - Array con los valores [fase0, fase1, fase2]
     */
    update(values) {
        if (!this.chart) {
            console.warn('⚠️ La gráfica no está inicializada');
            return;
        }

        const timeLabel = this._getCurrentTimeLabel();
        
        // Añadir nuevo punto de datos
        this.data.labels.push(timeLabel);
        
        // Actualizar cada fase con su valor
        values.forEach((value, index) => {
            this.data.datasets[index].data.push(value);
        });

        // Mantener solo los últimos puntos configurados
        this._trimData();

        // Actualizar la gráfica
        this.chart.update('none');
    }

    /**
     * Redimensiona la gráfica (útil para cambios de vista)
     */
    resize() {
        if (this.chart) {
            this.chart.resize();
        }
    }

    /**
     * Destruye la gráfica
     */
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    /**
     * Obtiene la etiqueta de tiempo actual
     * @private
     * @returns {string} Hora actual formateada
     */
    _getCurrentTimeLabel() {
        const now = new Date();
        return now.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    }

    /**
     * Recorta los datos antiguos para mantener el límite configurado
     * @private
     */
    _trimData() {
        while (this.data.labels.length > CONFIG.MAX_CHART_POINTS) {
            this.data.labels.shift();
            this.data.datasets.forEach(dataset => {
                dataset.data.shift();
            });
        }
    }

    /**
     * Verifica si la gráfica está inicializada
     * @returns {boolean} True si la gráfica está inicializada
     */
    isInitialized() {
        return this.chart !== null;
    }
}
