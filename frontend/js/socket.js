/**
 * Gestión de la comunicación WebSocket con el backend
 */

import { CONFIG, SELECTORS } from './config.js';

export class SocketManager {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.listeners = {
            dataReceived: [],
            connected: [],
            disconnected: [],
            error: []
        };
    }

    /**
     * Inicializa la conexión WebSocket
     */
    init() {
        console.log('🔌 Inicializando conexión WebSocket...');
        
        this.socket = io(CONFIG.BACKEND_URL);
        this._setupEventHandlers();
    }

    /**
     * Configura los manejadores de eventos del socket
     * @private
     */
    _setupEventHandlers() {
        this.socket.on('connect', () => {
            console.log('✅ Conectado al backend por WebSocket');
            this.connected = true;
            this._updateConnectionStatus('connected', 'Conectado');
            this._notifyListeners('connected');
        });

        this.socket.on('powerData', (data) => {
            this._handlePowerData(data);
        });

        this.socket.on('disconnect', () => {
            console.log('🔌 Conexión cerrada');
            this.connected = false;
            this._updateConnectionStatus('disconnected', 'Desconectado');
            this._notifyListeners('disconnected');
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ Error de conexión:', error);
            this.connected = false;
            this._updateConnectionStatus('error', 'Error de conexión');
            this._notifyListeners('error', error);
        });

        this.socket.on('reconnect', () => {
            console.log('🔄 Reconectando...');
            this._updateConnectionStatus('reconnecting', 'Reconectando...');
        });
    }

    /**
     * Maneja los datos de potencia recibidos
     * @private
     * @param {Object} data - Datos de potencia {fase0, fase1, fase2}
     */
    _handlePowerData(data) {
        // Validar que los datos tengan el formato esperado
        const validatedData = this._validatePowerData(data);
        
        if (validatedData.hasValidData) {
            console.log(`📊 Datos recibidos: ${JSON.stringify(validatedData.data)}`);
            this._notifyListeners('dataReceived', validatedData.data);
        }
    }

    /**
     * Valida los datos de potencia recibidos
     * @private
     * @param {Object} data - Datos recibidos
     * @returns {Object} Datos validados
     */
    _validatePowerData(data) {
        const validatedData = {};
        let hasValidData = false;

        ['fase0', 'fase1', 'fase2'].forEach(phase => {
            if (data[phase] !== undefined && !isNaN(parseFloat(data[phase]))) {
                validatedData[phase] = parseFloat(data[phase]);
                hasValidData = true;
            }
        });

        return { data: validatedData, hasValidData };
    }

    /**
     * Actualiza el indicador de estado de conexión
     * @private
     * @param {string} status - Estado de la conexión
     * @param {string} message - Mensaje a mostrar
     */
    _updateConnectionStatus(status, message) {
        const statusElement = document.querySelector(SELECTORS.connectionStatus);
        if (!statusElement) return;

        statusElement.innerHTML = `<div class="status-dot"></div><span>${message}</span>`;
        
        // Remover clases de estado previas
        statusElement.classList.remove('connected', 'disconnected', 'error', 'reconnecting');
        
        // Añadir clase del nuevo estado
        if (status !== 'disconnected') {
            statusElement.classList.add(status);
        }
    }

    /**
     * Registra un listener para un evento específico
     * @param {string} event - Tipo de evento (dataReceived, connected, disconnected, error)
     * @param {Function} callback - Función callback
     */
    on(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event].push(callback);
        } else {
            console.warn(`⚠️ Evento no válido: ${event}`);
        }
    }

    /**
     * Remueve un listener de un evento específico
     * @param {string} event - Tipo de evento
     * @param {Function} callback - Función callback a remover
     */
    off(event, callback) {
        if (this.listeners[event]) {
            const index = this.listeners[event].indexOf(callback);
            if (index > -1) {
                this.listeners[event].splice(index, 1);
            }
        }
    }

    /**
     * Notifica a todos los listeners de un evento
     * @private
     * @param {string} event - Tipo de evento
     * @param {*} data - Datos a pasar a los listeners
     */
    _notifyListeners(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`❌ Error en listener de ${event}:`, error);
                }
            });
        }
    }

    /**
     * Obtiene el estado de conexión
     * @returns {boolean} True si está conectado
     */
    isConnected() {
        return this.connected;
    }

    /**
     * Desconecta el socket
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    /**
     * Reconecta el socket
     */
    reconnect() {
        if (this.socket) {
            this.socket.connect();
        }
    }
}
