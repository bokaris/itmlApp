# -------------------------------
# ITML HR Backend Dockerfile
# -------------------------------

# Use official Node.js 20 Alpine image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose API port
EXPOSE 5000

# Start development server
CMD ["npm", "run", "dev"]
