# Use an official Node runtime as a parent image
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to /app
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to /app
COPY . .

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start"]
