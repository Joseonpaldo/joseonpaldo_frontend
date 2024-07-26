# Use the official Node.js image for version 22
FROM node:20 AS build

# Install pnpm
RUN npm install -g pnpm

# Create and change to the app directory
WORKDIR /app

# Copy the package files and install dependencies
COPY pnpm-lock.yaml ./
COPY package.json ./

# Install dependencies using pnpm package management
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN pnpm build

# Use a smaller Node.js runtime for the production build
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Set the working directory in the container
WORKDIR /app

# Copy only the built application and necessary files from the previous stage
COPY --from=build /app ./

# Install production dependencies
RUN pnpm install --prod

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["pnpm", "start"]