# Use the official Node.js image for version 22
FROM node:22

# Create and change to the app directory
WORKDIR /app

# Copy the package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Install `serve` to serve the build directory
RUN npm install -g serve

# Use `serve` to serve the app
CMD ["serve", "-s", "build"]

# Expose the port the app runs on
EXPOSE 3000