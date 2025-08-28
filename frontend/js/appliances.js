/**
 * Gestión de aparatos eléctricos y análisis de consumo solar
 */

import { APPLIANCES_DATA, APPLIANCE_STATES, SELECTORS } from './config.js';

export class ApplianceManager {
    constructor() {
        this.appliances = APPLIANCES_DATA;
        this.initialized = false;
    }

    /**
     * Inicializa la visualización de aparatos
     */
    init() {
        const appliancesGrid = document.querySelector(SELECTORS.appliancesGrid);
        if (!appliancesGrid) {
            console.error('❌ No se encontró el grid de aparatos');
            return;
        }

        appliancesGrid.innerHTML = '';
        
        Object.keys(this.appliances).forEach((phase, phaseIndex) => {
            this.appliances[phase].forEach(appliance => {
                const card = this._createApplianceCard(appliance, phase, phaseIndex);
                appliancesGrid.appendChild(card);
            });
        });

        this.initialized = true;
        console.log('🔌 Aparatos inicializados correctamente');
    }

    /**
     * Actualiza el análisis de aparatos con energía solar
     * @param {Array} solarPowerByPhase - Energía solar disponible por fase
     */
    updateSolarAnalysis(solarPowerByPhase) {
        if (!this.initialized) {
            console.warn('⚠️ Los aparatos no están inicializados');
            return;
        }

        // Actualizar indicador de energía solar total
        this._updateSolarIndicator(solarPowerByPhase);

        // Analizar cada aparato por fase
        Object.keys(this.appliances).forEach((phase, phaseIndex) => {
            this.appliances[phase].forEach(appliance => {
                this._updateApplianceStatus(appliance, phaseIndex, solarPowerByPhase[phaseIndex]);
            });
        });
    }

    /**
     * Crea una tarjeta de aparato
     * @private
     * @param {Object} appliance - Datos del aparato
     * @param {string} phase - Nombre de la fase
     * @param {number} phaseIndex - Índice de la fase
     * @returns {HTMLElement} Elemento DOM de la tarjeta
     */
    _createApplianceCard(appliance, phase, phaseIndex) {
        const card = document.createElement('div');
        card.className = 'appliance-card';
        card.setAttribute('data-phase', phaseIndex);
        card.setAttribute('data-appliance', appliance.aparato);
        
        const consumptionText = this._formatConsumptionText(appliance.consumo);
        const phaseLabel = `F${phaseIndex}`;
        
        card.innerHTML = `
            <div class="appliance-header">
                <div class="appliance-name">${appliance.aparato}</div>
                <div class="appliance-phase">${phaseLabel}</div>
            </div>
            <div class="appliance-consumption">${consumptionText}</div>
            <div class="appliance-status">
                <div class="status-icon"></div>
                <div class="status-text">Calculando...</div>
            </div>
        `;
        
        return card;
    }

    /**
     * Formatea el texto de consumo del aparato
     * @private
     * @param {Array} consumo - Array de consumos posibles
     * @returns {string} Texto formateado
     */
    _formatConsumptionText(consumo) {
        if (consumo.length > 1) {
            return `${Math.min(...consumo)}-${Math.max(...consumo)} W`;
        }
        return `${consumo[0]} W`;
    }

    /**
     * Actualiza el indicador de energía solar total
     * @private
     * @param {Array} solarPowerByPhase - Energía solar por fase
     */
    _updateSolarIndicator(solarPowerByPhase) {
        const totalSolar = solarPowerByPhase.reduce((sum, power) => sum + power, 0);
        const element = document.querySelector(SELECTORS.availableSolarPower);
        
        if (element) {
            element.textContent = `${totalSolar.toFixed(1)} W`;
        }
    }

    /**
     * Actualiza el estado de un aparato específico
     * @private
     * @param {Object} appliance - Datos del aparato
     * @param {number} phaseIndex - Índice de la fase
     * @param {number} phaseSolarPower - Energía solar disponible en la fase
     */
    _updateApplianceStatus(appliance, phaseIndex, phaseSolarPower) {
        const card = document.querySelector(`[data-appliance="${appliance.aparato}"]`);
        if (!card) return;

        const statusIcon = card.querySelector('.status-icon');
        const statusText = card.querySelector('.status-text');
        
        const minConsumption = Math.min(...appliance.consumo);
        const maxConsumption = Math.max(...appliance.consumo);
        
        const status = this._calculateApplianceStatus(phaseSolarPower, minConsumption, maxConsumption);
        
        // Actualizar la UI
        card.className = `appliance-card ${status.cssClass}`;
        statusIcon.className = `status-icon ${status.iconClass}`;
        statusText.className = `status-text ${status.textClass}`;
        statusText.textContent = status.message;
    }

    /**
     * Calcula el estado de un aparato basado en la energía solar disponible
     * @private
     * @param {number} solarPower - Energía solar disponible
     * @param {number} minConsumption - Consumo mínimo del aparato
     * @param {number} maxConsumption - Consumo máximo del aparato
     * @returns {Object} Estado del aparato
     */
    _calculateApplianceStatus(solarPower, minConsumption, maxConsumption) {
        if (solarPower === 0) {
            return {
                message: 'Pagarías la red',
                cssClass: APPLIANCE_STATES.NO_SOLAR,
                iconClass: 'red',
                textClass: APPLIANCE_STATES.NO_SOLAR
            };
        } else if (solarPower >= maxConsumption) {
            return {
                message: 'Usarlo es GRATIS',
                cssClass: APPLIANCE_STATES.FULL_SOLAR,
                iconClass: 'green',
                textClass: APPLIANCE_STATES.FULL_SOLAR
            };
        } else {
            return {
                message: 'Ahorrarías algo',
                cssClass: APPLIANCE_STATES.PARTIAL_SOLAR,
                iconClass: 'yellow',
                textClass: APPLIANCE_STATES.PARTIAL_SOLAR
            };
        }
    }

    /**
     * Obtiene el número total de aparatos
     * @returns {number} Total de aparatos
     */
    getTotalAppliances() {
        return Object.values(this.appliances)
            .reduce((total, phaseAppliances) => total + phaseAppliances.length, 0);
    }

    /**
     * Verifica si los aparatos están inicializados
     * @returns {boolean} True si están inicializados
     */
    isInitialized() {
        return this.initialized;
    }
}
