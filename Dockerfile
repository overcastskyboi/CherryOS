# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Define build arguments
ARG VITE_PROXY_URL
ARG VITE_WEATHER_API_KEY
ARG VITE_OCI_NAMESPACE
ARG VITE_OCI_REGION
ARG VITE_STEAM_ID
ARG VITE_AL_ID
ARG VITE_AL_TOKEN

# Set them as environment variables during build
ENV VITE_PROXY_URL=$VITE_PROXY_URL
ENV VITE_WEATHER_API_KEY=$VITE_WEATHER_API_KEY
ENV VITE_OCI_NAMESPACE=$VITE_OCI_NAMESPACE
ENV VITE_OCI_REGION=$VITE_OCI_REGION
ENV VITE_STEAM_ID=$VITE_STEAM_ID
ENV VITE_AL_ID=$VITE_AL_ID
ENV VITE_AL_TOKEN=$VITE_AL_TOKEN

# Copy only dependency files first for caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy only necessary source files
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./
COPY vite.config.js ./
COPY eslint.config.js ./

# Build
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
# Copy the built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Inject a custom Nginx configuration to handle React single-page app routing
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
