# Stage 1: Build the React app
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files and build the production assets
COPY . .
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine
# Copy the built assets from Vite's default output directory (dist) to Nginx's public folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]