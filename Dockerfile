FROM node:20-alpine

WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies sử dụng npm install thay vì npm ci
RUN npm install

# Sao chép toàn bộ source code
COPY . .

# Chạy lệnh build
RUN npm run build

# Chuyển đến thư mục build
WORKDIR /app/build

# Cài đặt dependencies cho production, bỏ qua devDependencies
RUN npm install --only=production

# Expose port mà ứng dụng sẽ chạy
EXPOSE 3333

# Chạy ứng dụng
CMD ["node", "bin/server.js"]