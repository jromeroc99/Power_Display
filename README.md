# Power Display 🔌⚡

Dashboard en tiempo real para monitoreo de potencia eléctrica con análisis de fases y gestión de aparatos inteligente.

## 🚀 Características Principales

- **Monitoreo en Tiempo Real**: Visualización continua de datos de potencia eléctrica
- **Análisis Trifásico**: Gestión completa de las tres fases eléctricas
- **Dashboard Interactivo**: Interface web responsiva con múltiples vistas
- **Conexión MQTT**: Integración con sensores IoT para datos en vivo
- **Análisis de Aparatos**: Detección inteligente del estado de funcionamiento
- **Cálculo de Energía Solar**: Determinación automática de energía solar disponible
- **WebSocket**: Comunicación bidireccional en tiempo real
- **Docker Ready**: Despliegue fácil con contenedores

## 📁 Estructura del Proyecto

```
Power_Display/
├── 📄 README.md              # Este archivo
├── 📄 package.json           # Dependencias y scripts
├── 📄 docker-compose.yml     # Configuración Docker
├── 📄 Dockerfile            # Imagen Docker
├── 📄 LICENSE               # Licencia MIT
├── 📂 backend/              # Servidor Node.js
│   └── server.js           # Aplicación principal del servidor
├── 📂 frontend/             # Dashboard web
│   ├── index.html          # Página principal
│   ├── styles.css          # Estilos CSS
│   ├── dashboard-refactored.js  # App principal refactorizada
│   ├── README.md           # Documentación del frontend
│   └── js/                 # Módulos JavaScript
│       ├── config.js       # Configuración
│       ├── phases.js       # Gestión de fases
│       ├── chart.js        # Gráficas Chart.js
│       ├── appliances.js   # Análisis de aparatos
│       ├── socket.js       # WebSocket client
│       └── ui.js          # Gestión de UI
├── 📂 logs/                # Archivos de log
└── 📂 pruebas/             # Scripts de prueba
    └── prueba-mqtt.js      # Pruebas MQTT
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js**: Servidor de aplicación
- **Express**: Framework web
- **Socket.IO**: WebSocket para tiempo real
- **MQTT**: Protocolo de mensajería IoT
- **CORS**: Habilitación de recursos cruzados

### Frontend
- **Vanilla JavaScript ES6+**: Sin frameworks pesados
- **Chart.js**: Gráficas interactivas
- **WebSocket Client**: Comunicación en tiempo real
- **CSS3**: Estilos modernos y responsivos
- **Arquitectura Modular**: Código organizado y mantenible

### DevOps
- **Docker**: Contenedorización
- **Docker Compose**: Orquestación de servicios

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone https://github.com/jromeroc99/Power_Display.git
cd Power_Display
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto:
```env
MQTT_URL=mqtt://tu-broker-mqtt:1883
MQTT_USERNAME=tu_usuario
MQTT_PASSWORD=tu_password
PORT=3000
NODE_ENV=development
```

### 4. Ejecutar la Aplicación

#### Desarrollo Local
```bash
npm start
# o
npm run dev
```

#### Con Docker
```bash
docker-compose up -d
```

La aplicación estará disponible en `http://localhost:3000`

## 🔧 Configuración MQTT

El sistema se conecta a un broker MQTT para recibir datos de sensores. Los topics esperados son:

```
energia/fase0    # Datos de la fase 0
energia/fase1    # Datos de la fase 1  
energia/fase2    # Datos de la fase 2
```

Los mensajes deben tener el formato JSON:
```json
{
  "potencia": 1250.5,
  "tension": 230.2,
  "corriente": 5.43,
  "timestamp": "2025-08-28T10:30:00Z"
}
```

## 📊 Funcionalidades del Dashboard

### 🔍 Vistas Disponibles
1. **Vista General**: Todos los componentes visibles
2. **Solo Fases**: Panel de monitoreo de fases eléctricas
3. **Solo Aparatos**: Análisis de estado de aparatos
4. **Solo Gráfica**: Visualización temporal de datos

### 📈 Características Avanzadas
- **Cálculo Automático**: Energía solar disponible en tiempo real
- **Estado de Aparatos**: Detección si funcionan con energía solar
- **Notificaciones**: Sistema de alertas y estados
- **Temas**: Modo claro y oscuro
- **Responsive**: Adaptado a móviles y tablets
- **Reconexión Automática**: Manejo robusto de desconexiones

## 🧪 Pruebas

### Ejecutar Prueba MQTT
```bash
npm run start:prueba
```

### Debug en Navegador
Abre las herramientas de desarrollo y usa:
```javascript
// Obtener estadísticas actuales
getStats()

// Cambiar vista
selectView('chart') // 'all', 'phases', 'appliances', 'chart'

// Mostrar notificación
showNotification('Mensaje de prueba', 'success')
```

## 🐳 Docker

### Construir Imagen
```bash
docker build -t power-display .
```

### Ejecutar Contenedor
```bash
docker run -p 3000:3000 \
  -e MQTT_URL=mqtt://tu-broker:1883 \
  -e MQTT_USERNAME=usuario \
  -e MQTT_PASSWORD=password \
  power-display
```

## 📚 API y Endpoints

### WebSocket Events
```javascript
// Eventos del cliente
socket.on('power-data', (data) => {
  // Recibir datos de potencia
});

socket.on('connection-status', (status) => {
  // Estado de conexión MQTT
});

// Eventos del servidor
socket.emit('request-data');           // Solicitar datos
socket.emit('get-historical', count);  // Obtener histórico
```

### HTTP Endpoints
```
GET  /                    # Dashboard principal
GET  /api/status         # Estado del servidor
GET  /api/health         # Health check
```

## 🔧 Desarrollo

### Estructura de Clases (Frontend)
- `PowerDisplayApp`: Coordinador principal
- `PhaseManager`: Gestión de fases eléctricas  
- `ChartManager`: Gráficas y visualización
- `ApplianceManager`: Análisis de aparatos
- `SocketManager`: Comunicación WebSocket
- `UIManager`: Interface y notificaciones

### Añadir Nuevos Aparatos
Edita `APPLIANCES_DATA` en `frontend/js/config.js`:
```javascript
{
  name: "Nuevo Aparato",
  phase: 0,
  consumption: 800,
  // ... más propiedades
}
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Changelog

### v1.0.0 (2025-08-28)
- ✨ Frontend refactorizado con arquitectura modular
- 🚀 Implementación de WebSocket para tiempo real
- 📊 Sistema de gráficas mejorado con Chart.js
- 🎨 UI/UX renovada con temas claro/oscuro
- 🔄 Reconexión automática robusta
- 📱 Diseño completamente responsive
- 🐳 Soporte Docker completo
- 🧪 Suite de pruebas automatizadas

## 🐛 Problemas Conocidos

- Ninguno reportado actualmente

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

**jromeroc99**
- GitHub: [@jromeroc99](https://github.com/jromeroc99)

## ⭐ Reconocimientos

- Chart.js por las excelentes gráficas
- Socket.IO por la comunicación en tiempo real
- Comunidad MQTT por el protocolo robusto

---

<div align="center">

**[⬆ Volver arriba](#power-display-)**

Hecho con ❤️ para monitoreo de energía inteligente

</div>