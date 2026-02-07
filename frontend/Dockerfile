# Use Node image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose Vite port
EXPOSE 5173

# Start Vite with network access
CMD ["npm", "run", "dev", "--", "--host"]