# Etapa de construcción
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar los archivos necesarios
COPY package*.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar el resto del código fuente
COPY . .

# Generar el cliente de Prisma
RUN npx prisma generate

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine
WORKDIR /app

# Copiar los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Asegúrate de que esto apunta a tu archivo de entrada principal
CMD ["node", "dist/src/main"]

# Exponer el puerto
EXPOSE 8088