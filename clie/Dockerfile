# Stage 1: Build the React app
FROM node:20-alpine 

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the React app for production
RUN npm run build


# Expose port
EXPOSE 5173

# Start the app
CMD ["npm","run","preview"]
