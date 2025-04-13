# Use the official Node.js image as the base image
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package*.json pnpm-lock.yaml* ./

# Install the application dependencies
RUN pnpm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN pnpm run build

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]