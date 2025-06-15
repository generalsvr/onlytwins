# Use a lightweight Node.js base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm install --production --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Explicitly set npm as the package manager for Next.js
ENV NEXT_PRIVATE_LOCAL_PACKAGE_MANAGER=npm

# Build the Next.js app
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]