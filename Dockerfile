# Use Node.js 20 as base image
FROM --platform=linux/amd64 node:20.12.2

EXPOSE 3000

ENV NODE_ENV production

# Create and set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN npm run build

# Set the command to start the Next.js app
CMD ["npm", "start"]