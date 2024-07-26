FROM node:20-alpine

WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code
COPY . .

# Chạy lệnh build
RUN npm run build

# Kiểm tra xem file đã được tạo chưa
RUN ls -la build/

EXPOSE 3333

CMD ["node", "build/server.js"]