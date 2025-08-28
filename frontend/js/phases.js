/**
 * Gestión del estado de las fases eléctricas
 */

import { SELECTORS } from './config.js';

export class PhaseManager {
    constructor() {
        this.values = {
            fase0: 0,
            fase1: 0,
            fase2: 0
        };
    }

    /**
     * Actualiza el valor de una fase
     * @param {string} phase - Nombre de la fase (fase0, fase1, fase2)
     * @param {number} value - Valor de potencia
     */
    updatePhase(phase, value) {
        if (this.values.hasOwnProperty(phase)) {
            this.values[phase] = parseFloat(value);
            this._formatPowerDisplay(phase, this.values[phase]);
        }
    }

    /**
     * Obtiene todos los valores de las fases
     * @returns {Object} Objeto con los valores de las fases
     */
    getAllValues() {
        return { ...this.values };
    }

    /**
     * Obtiene el array de valores para la gráfica
     * @returns {Array} Array con los valores [fase0, fase1, fase2]
     */
    getValuesArray() {
        return [this.values.fase0, this.values.fase1, this.values.fase2];
    }

    /**
     * Calcula la energía solar disponible por fase
     * @returns {Array} Array con energía solar por fase
     */
    getSolarPowerByPhase() {
        return [
            this.values.fase0 < 0 ? Math.abs(this.values.fase0) : 0,
            this.values.fase1 < 0 ? Math.abs(this.values.fase1) : 0,
            this.values.fase2 < 0 ? Math.abs(this.values.fase2) : 0
        ];
    }

    /**
     * Calcula la energía solar total disponible
     * @returns {number} Total de energía solar disponible
     */
    getTotalSolarPower() {
        return this.getSolarPowerByPhase().reduce((sum, power) => sum + power, 0);
    }

    /**
     * Formatea y muestra la potencia de una fase
     * @private
     * @param {string} phase - Nombre de la fase
     * @param {number} value - Valor de potencia
     */
    _formatPowerDisplay(phase, value) {
        const phaseIndex = phase.replace('fase', '');
        
        // Elementos originales (mantenemos por compatibilidad si existen)
        const element = document.getElementById(phase);
        const indicator = document.getElementById(`indicator-${phaseIndex}`);
        const statusElement = document.getElementById(`status-${phaseIndex}`);
        const phaseCard = document.querySelector(`[data-phase="${phaseIndex}"]`);
        
        // Nuevos elementos mini
        const miniElement = document.getElementById(`mini-${phase}`);
        const miniIndicator = document.getElementById(`mini-indicator-${phaseIndex}`);
        const miniPhaseCard = document.querySelector(`.phase-mini-card[data-phase="${phaseIndex}"]`);
        const miniType = document.getElementById(`mini-type-${phaseIndex}`);

        if (value < 0) {
            // Potencia negativa = Generación solar
            this._setSolarDisplay(element, indicator, statusElement, phaseCard, Math.abs(value));
            this._setMiniSolarDisplay(miniElement, miniIndicator, miniPhaseCard, miniType, Math.abs(value));
        } else {
            // Potencia positiva = Consumo
            this._setConsumptionDisplay(element, indicator, statusElement, phaseCard, value);
            this._setMiniConsumptionDisplay(miniElement, miniIndicator, miniPhaseCard, miniType, value);
        }
    }

    /**
     * Configura la visualización para generación solar
     * @private
     */
    _setSolarDisplay(element, indicator, statusElement, phaseCard, value) {
        if (element) {
            element.textContent = `${value.toFixed(1)} W`;
            element.classList.add('solar-power');
            element.classList.remove('consumption-power');
        }

        if (indicator) {
            indicator.className = 'phase-indicator solar';
        }

        if (statusElement) {
            statusElement.textContent = '🌞 Generación Solar';
            statusElement.className = 'phase-status solar';
        }

        if (phaseCard) {
            phaseCard.classList.add('solar-active');
            phaseCard.classList.remove('consumption-active');
        }
    }

    /**
     * Configura la visualización para consumo
     * @private
     */
    _setConsumptionDisplay(element, indicator, statusElement, phaseCard, value) {
        if (element) {
            element.textContent = `${value.toFixed(1)} W`;
            element.classList.add('consumption-power');
            element.classList.remove('solar-power');
        }

        if (indicator) {
            indicator.className = 'phase-indicator consumption';
        }

        if (statusElement) {
            statusElement.textContent = '🏠 Consumo de Vivienda';
            statusElement.className = 'phase-status consumption';
        }

        if (phaseCard) {
            phaseCard.classList.add('consumption-active');
            phaseCard.classList.remove('solar-active');
        }
    }

    /**
     * Configura la visualización mini para generación solar
     * @private
     */
    _setMiniSolarDisplay(element, indicator, phaseCard, typeElement, value) {
        if (element) {
            element.textContent = `${value.toFixed(0)}W`;
            element.classList.add('solar-power');
            element.classList.remove('consumption-power');
        }

        if (indicator) {
            indicator.className = 'phase-mini-indicator solar';
        }

        if (typeElement) {
            typeElement.textContent = 'Generación Solar';
            typeElement.className = 'phase-mini-type solar';
        }

        if (phaseCard) {
            phaseCard.classList.add('solar-active');
            phaseCard.classList.remove('consumption-active');
        }
    }

    /**
     * Configura la visualización mini para consumo
     * @private
     */
    _setMiniConsumptionDisplay(element, indicator, phaseCard, typeElement, value) {
        if (element) {
            element.textContent = `${value.toFixed(0)}W`;
            element.classList.add('consumption-power');
            element.classList.remove('solar-power');
        }

        if (indicator) {
            indicator.className = 'phase-mini-indicator consumption';
        }

        if (typeElement) {
            typeElement.textContent = 'Consumo Vivienda';
            typeElement.className = 'phase-mini-type consumption';
        }

        if (phaseCard) {
            phaseCard.classList.add('consumption-active');
            phaseCard.classList.remove('solar-active');
        }
    }
}
