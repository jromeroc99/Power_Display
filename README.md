# Power Display 🔌⚡

Dashboard en tiempo real para monitoreo de consumo de potencia eléctrica en instalaciones con medidores Shelly. Este proyecto proporciona una interfaz web moderna y responsiva que muestra el consumo eléctrico de tres fases de manera simultánea.

## 📋 Características

- **Monitoreo en tiempo real**: Visualización instantánea del consumo eléctrico por fases
- **Interfaz moderna**: Dashboard responsivo con indicadores visuales de potencia
- **Arquitectura eficiente**: Backend Node.js con WebSockets para comunicación en tiempo real
- **Containerización**: Aplicación completamente dockerizada para fácil despliegue
- **Conexión MQTT**: Integración con dispositivos Shelly para obtención de datos
- **Estado de conexión**: Indicadores visuales del estado de conectividad
- **Healthcheck**: Monitoreo automático del estado de la aplicación

## 🏗️ Arquitectura

```
┌─────────────────┐    MQTT     ┌──────────────────┐    WebSocket    ┌─────────────────┐
│  Dispositivos   │◄────────────►│   Backend        │◄───────────────►│   Frontend      │
│  Shelly         │             │  (Node.js)       │                 │  (HTML/CSS/JS)  │
└─────────────────┘             └──────────────────┘                 └─────────────────┘
```

### Componentes principales:
- **Backend**: Servidor Express.js con Socket.IO y cliente MQTT
- **Frontend**: Dashboard web con visualización de datos en tiempo real
- **Docker**: Containerización para despliegue simplificado

## 🚀 Instalación y Configuración

### Prerequisitos
- Docker y Docker Compose
- Dispositivos Shelly configurados con MQTT
- Broker MQTT accesible

### Configuración del entorno

1. **Clona el repositorio:**
```bash
git clone https://github.com/jromeroc99/Power_Display.git
cd Power_Display
```

2. **Configura las variables de entorno:**
Crea un archivo `.env` en la raíz del proyecto:
```env
MQTT_URL=mqtt://tu-broker-mqtt:1883
MQTT_USERNAME=tu_usuario
MQTT_PASSWORD=tu_contraseña
```

3. **Ejecuta con Docker Compose:**
```bash
docker compose up -d --build
```

La aplicación estará disponible en `http://localhost:3000`

## 🛠️ Desarrollo local

### Sin Docker

1. **Instala las dependencias:**
```bash
npm install
```

2. **Configura el archivo `.env`** (como se describe arriba)

3. **Ejecuta la aplicación:**
```bash
npm start
```

### Scripts disponibles
- `npm start`: Ejecuta el servidor en modo producción
- `npm run dev`: Ejecuta el servidor en modo desarrollo
- `npm run start:prueba`: Ejecuta script de prueba MQTT

## 📊 Temas MQTT monitoreados

La aplicación se suscribe a los siguientes temas MQTT:

- `shellies/ipe/sotano/cuadro/emeter/0/power` - Fase 0
- `shellies/ipe/sotano/cuadro/emeter/1/power` - Fase 1  
- `shellies/ipe/sotano/cuadro/emeter/2/power` - Fase 2

## 🖥️ Interfaz de usuario

El dashboard incluye:

- **Panel de fases**: Muestra el consumo actual de cada fase con indicadores de color
- **Estado de conexión**: Indicador visual del estado de conectividad MQTT/WebSocket
- **Información en tiempo real**: Datos actualizados instantáneamente
- **Diseño responsivo**: Adaptable a diferentes tamaños de pantalla

## 🐳 Docker

### Imagen Docker
- Basada en `node:18-alpine` para un tamaño optimizado
- Usuario no-root para mayor seguridad
- Healthcheck integrado para monitoreo

### Configuración Docker Compose
- Puerto expuesto: 3000
- Volúmenes para logs persistentes
- Reinicio automático en caso de fallos
- Variables de entorno configurables

## 📁 Estructura del proyecto

```
Power_Display/
├── backend/
│   └── server.js           # Servidor principal Node.js
├── frontend/
│   ├── index.html          # Interfaz web principal
│   ├── dashboard.js        # Lógica del frontend
│   └── styles.css          # Estilos CSS
├── logs/                   # Directorio de logs
├── pruebas/
│   └── prueba-mqtt.js      # Scripts de prueba MQTT
├── docker-compose.yml      # Configuración Docker Compose
├── Dockerfile              # Configuración Docker
├── package.json            # Dependencias y scripts
└── README.md              # Este archivo
```

## 🔧 Configuración avanzada

### Variables de entorno disponibles

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `MQTT_URL` | URL del broker MQTT | Requerido |
| `MQTT_USERNAME` | Usuario MQTT | Requerido |
| `MQTT_PASSWORD` | Contraseña MQTT | Requerido |
| `PORT` | Puerto del servidor | 3000 |
| `NODE_ENV` | Entorno de ejecución | development |

### Personalización de temas MQTT

Para modificar los temas MQTT monitoreados, edita las constantes en `backend/server.js`:

```javascript
const topicFase0 = "tu/tema/fase0";
const topicFase1 = "tu/tema/fase1";
const topicFase2 = "tu/tema/fase2";
```

## 🩺 Monitoreo y salud

### Healthcheck
La aplicación incluye un endpoint de healthcheck que verifica:
- Estado del servidor web
- Conectividad general de la aplicación

### Logs
Los logs se pueden acceder mediante:
```bash
docker compose logs -f power-display
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**jromeroc99** - [GitHub](https://github.com/jromeroc99)

---

⚡ **Power Display** - Monitoreo inteligente de consumo eléctrico en tiempo real
