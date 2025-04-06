# Stage 1: Builder
FROM node:20-alpine AS builder

# Install dependencies needed to build native modules
RUN apk add --no-cache python3 make g++

WORKDIR /src

# Copy package files and install dependencies, forcing a rebuild of native modules
COPY package*.json ./
RUN npm install --build-from-source

# Copy the rest of your source code
COPY . .

# Rebuild bcrypt explicitly
RUN npm rebuild bcrypt --build-from-source

# Stage 2: Tester
FROM node:20-alpine AS tester

WORKDIR /src

# Copy all source code from the builder stage
COPY --from=builder /src .

# Run tests at container runtime (not during build)
CMD ["npm", "run", "test"]

# Stage 3: Development
FROM node:20-alpine AS development

WORKDIR /src

# Copy only the necessary files from the builder stage for development
COPY --from=builder /src .

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
