/**
 * Gestión de la interfaz de usuario y navegación
 */

import { SELECTORS } from './config.js';

export class UIManager {
    constructor(chartManager) {
        this.chartManager = chartManager;
        this.currentView = 'all';
    }

    /**
     * Inicializa la interfaz de usuario
     */
    init() {
        this._initComponentSelector();
        console.log('🎨 Interfaz de usuario inicializada');
    }

    /**
     * Inicializa el selector de componentes
     * @private
     */
    _initComponentSelector() {
        const selectorButtons = document.querySelectorAll(SELECTORS.selectorButtons);
        const mainContent = document.querySelector(SELECTORS.mainContent);
        
        if (!selectorButtons.length || !mainContent) {
            console.warn('⚠️ No se encontraron elementos del selector de componentes');
            return;
        }

        selectorButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const component = event.currentTarget.getAttribute('data-component');
                this.selectComponent(component);
            });
        });
    }

    /**
     * Selecciona un componente para mostrar
     * @param {string} component - Componente a mostrar (all, phases, appliances, chart)
     */
    selectComponent(component) {
        const selectorButtons = document.querySelectorAll(SELECTORS.selectorButtons);
        const mainContent = document.querySelector(SELECTORS.mainContent);

        if (!mainContent) return;

        // Actualizar botones activos
        selectorButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-component') === component) {
                btn.classList.add('active');
            }
        });

        // Aplicar clase de vista al contenido principal
        mainContent.className = 'main-content';
        if (component !== 'all') {
            mainContent.classList.add(`view-${component}`);
        }

        // Redimensionar gráfica si es necesario
        if (component === 'chart' && this.chartManager.isInitialized()) {
            setTimeout(() => {
                this.chartManager.resize();
            }, 300);
        }

        this.currentView = component;
        console.log(`📱 Vista cambiada a: ${component}`);
    }

    /**
     * Obtiene la vista actual
     * @returns {string} Vista actual
     */
    getCurrentView() {
        return this.currentView;
    }

    /**
     * Muestra un mensaje de notificación
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de mensaje (success, error, warning, info)
     * @param {number} duration - Duración en ms (opcional)
     */
    showNotification(message, type = 'info', duration = 3000) {
        const notification = this._createNotificationElement(message, type);
        document.body.appendChild(notification);

        // Mostrar la notificación
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Ocultar y remover la notificación
        if (duration > 0) {
            setTimeout(() => {
                this._hideNotification(notification);
            }, duration);
        }
    }

    /**
     * Crea un elemento de notificación
     * @private
     * @param {string} message - Mensaje
     * @param {string} type - Tipo de notificación
     * @returns {HTMLElement} Elemento de notificación
     */
    _createNotificationElement(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Cerrar">&times;</button>
            </div>
        `;

        // Añadir listener para cerrar
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            this._hideNotification(notification);
        });

        return notification;
    }

    /**
     * Oculta una notificación
     * @private
     * @param {HTMLElement} notification - Elemento de notificación
     */
    _hideNotification(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    /**
     * Actualiza el tema de la interfaz
     * @param {string} theme - Tema (light, dark, auto)
     */
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('dashboard-theme', theme);
        console.log(`🎨 Tema cambiado a: ${theme}`);
    }

    /**
     * Obtiene el tema actual
     * @returns {string} Tema actual
     */
    getTheme() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    }

    /**
     * Carga el tema guardado
     */
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('dashboard-theme') || 'light';
        this.setTheme(savedTheme);
    }

    /**
     * Añade una clase CSS temporal a un elemento
     * @param {HTMLElement|string} element - Elemento o selector
     * @param {string} className - Clase CSS
     * @param {number} duration - Duración en ms
     */
    addTemporaryClass(element, className, duration = 1000) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;

        el.classList.add(className);
        setTimeout(() => {
            el.classList.remove(className);
        }, duration);
    }

    /**
     * Anima un elemento con efecto de pulso
     * @param {HTMLElement|string} element - Elemento o selector
     */
    pulseElement(element) {
        this.addTemporaryClass(element, 'pulse-animation', 1000);
    }
}
