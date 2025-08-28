/**
 * Aplicación principal del dashboard de energía solar
 * Coordina todos los módulos y gestiona la lógica principal
 */

import { PhaseManager } from './js/phases.js';
import { ChartManager } from './js/chart.js';
import { ApplianceManager } from './js/appliances.js';
import { SocketManager } from './js/socket.js';
import { UIManager } from './js/ui.js';

class PowerDisplayApp {
    constructor() {
        // Inicializar managers
        this.phaseManager = new PhaseManager();
        this.chartManager = new ChartManager();
        this.applianceManager = new ApplianceManager();
        this.socketManager = new SocketManager();
        this.uiManager = new UIManager(this.chartManager);
        
        this.isInitialized = false;
    }

    /**
     * Inicializa la aplicación
     */
    async init() {
        console.log('🚀 Inicializando Power Display Dashboard...');
        
        try {
            // Inicializar UI primero
            this.uiManager.init();
            this.uiManager.loadSavedTheme();
            
            // Inicializar componentes visuales
            this.chartManager.init();
            this.applianceManager.init();
            
            // Configurar comunicación WebSocket
            this._setupSocketHandlers();
            this.socketManager.init();
            
            // Configurar eventos de la aplicación
            this._setupAppEvents();
            
            this.isInitialized = true;
            console.log('✅ Dashboard inicializado correctamente');
            
            this.uiManager.showNotification('Dashboard inicializado correctamente', 'success');
            
        } catch (error) {
            console.error('❌ Error inicializando la aplicación:', error);
            this.uiManager.showNotification('Error al inicializar el dashboard', 'error');
        }
    }

    /**
     * Configura los manejadores de eventos del socket
     * @private
     */
    _setupSocketHandlers() {
        // Manejar datos de potencia recibidos
        this.socketManager.on('dataReceived', (data) => {
            this._handlePowerDataUpdate(data);
        });

        // Manejar eventos de conexión
        this.socketManager.on('connected', () => {
            this.uiManager.showNotification('Conectado al servidor', 'success', 2000);
        });

        this.socketManager.on('disconnected', () => {
            this.uiManager.showNotification('Conexión perdida', 'warning', 3000);
        });

        this.socketManager.on('error', (error) => {
            this.uiManager.showNotification('Error de conexión', 'error', 5000);
        });
    }

    /**
     * Maneja la actualización de datos de potencia
     * @private
     * @param {Object} data - Datos de potencia
     */
    _handlePowerDataUpdate(data) {
        let dataChanged = false;

        // Actualizar valores de fases
        Object.keys(data).forEach(phase => {
            this.phaseManager.updatePhase(phase, data[phase]);
            dataChanged = true;
        });

        if (dataChanged) {
            this._updateAllComponents();
            this._logCurrentValues();
        }
    }

    /**
     * Actualiza todos los componentes con los nuevos datos
     * @private
     */
    _updateAllComponents() {
        // Obtener datos actualizados
        const phaseValues = this.phaseManager.getValuesArray();
        const solarPowerByPhase = this.phaseManager.getSolarPowerByPhase();

        // Actualizar gráfica
        this.chartManager.update(phaseValues);

        // Actualizar análisis de aparatos
        this.applianceManager.updateSolarAnalysis(solarPowerByPhase);

        // Efectos visuales opcionales
        this._addVisualFeedback();
    }

    /**
     * Añade feedback visual cuando se reciben datos
     * @private
     */
    _addVisualFeedback() {
        // Pulsar indicador de conexión brevemente
        this.uiManager.addTemporaryClass('#connection-status', 'data-received', 500);
    }

    /**
     * Registra los valores actuales en la consola
     * @private
     */
    _logCurrentValues() {
        const values = this.phaseManager.getAllValues();
        const totalSolar = this.phaseManager.getTotalSolarPower();
        
        console.log(`📊 Valores: F0=${values.fase0}W, F1=${values.fase1}W, F2=${values.fase2}W | Solar=${totalSolar}W`);
    }

    /**
     * Configura eventos globales de la aplicación
     * @private
     */
    _setupAppEvents() {
        // Manejar errores globales
        window.addEventListener('error', (event) => {
            console.error('❌ Error global:', event.error);
            this.uiManager.showNotification('Se produjo un error inesperado', 'error');
        });

        // Manejar visibilidad de la página
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('📱 Página oculta - pausando actualizaciones visuales');
            } else {
                console.log('📱 Página visible - reanudando actualizaciones');
                // Redimensionar gráfica al volver a la página
                setTimeout(() => {
                    this.chartManager.resize();
                }, 100);
            }
        });

        // Manejar cambio de tamaño de ventana
        window.addEventListener('resize', () => {
            this.chartManager.resize();
        });
    }

    /**
     * Obtiene estadísticas de la aplicación
     * @returns {Object} Estadísticas actuales
     */
    getStats() {
        const phases = this.phaseManager.getAllValues();
        const totalSolar = this.phaseManager.getTotalSolarPower();
        const totalAppliances = this.applianceManager.getTotalAppliances();

        return {
            phases,
            totalSolar,
            totalAppliances,
            isConnected: this.socketManager.isConnected(),
            currentView: this.uiManager.getCurrentView(),
            chartInitialized: this.chartManager.isInitialized(),
            appliancesInitialized: this.applianceManager.isInitialized()
        };
    }

    /**
     * Limpia recursos de la aplicación
     */
    cleanup() {
        console.log('🧹 Limpiando recursos...');
        
        this.socketManager.disconnect();
        this.chartManager.destroy();
        
        console.log('✅ Recursos limpiados');
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia global de la aplicación
    window.powerDisplayApp = new PowerDisplayApp();
    
    // Inicializar la aplicación
    window.powerDisplayApp.init();
    
    // Exponer funciones útiles para debugging en consola
    if (typeof window !== 'undefined') {
        window.getStats = () => window.powerDisplayApp.getStats();
        window.selectView = (view) => window.powerDisplayApp.uiManager.selectComponent(view);
        window.showNotification = (msg, type) => window.powerDisplayApp.uiManager.showNotification(msg, type);
    }
});

// Limpiar recursos al cerrar la página
window.addEventListener('beforeunload', () => {
    if (window.powerDisplayApp) {
        window.powerDisplayApp.cleanup();
    }
});
