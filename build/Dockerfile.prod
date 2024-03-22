# Stage 1: Build
FROM node:latest AS build

# Set the working directory in the container
WORKDIR /home/app

# Copy package.json and package-lock.json from the app directory
COPY ./app/package*.json ./

# Install dependencies for production environments, omitting the installation of devDependencies
RUN npm install

# Copy the application files from the app directory
COPY ./app/app.js ./
COPY ./app/views ./views/

# Stage 2: Runtime
FROM node:slim

# Set the working directory in the container
WORKDIR /home/app

# Copy from the build stage
COPY --from=build /home/app /home/app

# Expose port 3000
EXPOSE 3000

# Define the command to run the app
CMD ["node", "app.js"]
