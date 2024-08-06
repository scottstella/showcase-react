# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /showcase-react/

# Copy package.json and package-lock.json (if available)
COPY package*.json ./
COPY vite.config.js ./
COPY index.html ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port that Vite uses
EXPOSE 5173

# Start the application
CMD ["npm", "run", "start"]