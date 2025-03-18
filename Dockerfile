FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN  npm i --legacy-peer-deps

COPY . .

RUN npm run build

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Asegúrate de que esto apunta a tu archivo de entrada principal
CMD ["node", "dist/src/main"]

# Exponer el puerto
EXPOSE 3000