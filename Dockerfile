# Use a lightweight Node.js base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install all dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Explicitly set npm as the package manager for Next.js
ENV NEXT_PRIVATE_LOCAL_PACKAGE_MANAGER=npm

# Set build-time environment variables (required for Next.js bundling)
ENV NEXT_PUBLIC_MEDIA_URL=https://platform.onlytwins.ai/media
ENV STRIPE_SECRET_KEY=sk_test_dummy_key_for_build_only

# Build the Next.js app
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]