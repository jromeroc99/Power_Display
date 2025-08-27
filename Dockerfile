# Usar imagen oficial de Node.js versión LTS
FROM node:18-alpine

# Instalar wget para el healthcheck
RUN apk add --no-cache wget

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de package
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Exponer puerto de la aplicación
EXPOSE 3000

# Crear usuario no root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Cambiar permisos del directorio de trabajo
RUN chown -R nodejs:nodejs /app

# Cambiar a usuario no root
USER nodejs

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
