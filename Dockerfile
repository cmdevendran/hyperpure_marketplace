# Base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install dependencies
#RUN npm install
RUN npm install --legacy-peer-deps


# Copy remaining application code
COPY . .

# Expose Expo Web default port
EXPOSE 8081

# Set non-interactive CI environment variable
ENV CI=true

# Start Expo Web server binding to port 8081
CMD ["npx", "expo", "start", "--web", "--port", "8081"]
