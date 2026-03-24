FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install only production dependencies to keep the image small
RUN npm ci --omit=dev

# Copy the remaining backend source code
COPY . .

# Expose the port the app runs on (usually 5001 based on CI workflows)
EXPOSE 5001

# Command to run the application
CMD ["npm", "start"]
