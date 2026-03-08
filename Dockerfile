FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

# Generate Prisma Client (Bản v6 hỗ trợ URL trực tiếp trong schema)
RUN npx prisma generate

RUN npm run build

EXPOSE 3000

# Lệnh khởi chạy: Migrate DB xong mới chạy App
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]