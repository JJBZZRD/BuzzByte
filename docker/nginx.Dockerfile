FROM nginx:1.25-alpine

# Remove default configuration
RUN rm /etc/nginx/conf.d/default.conf

# Create required directories
RUN mkdir -p /var/www/certbot

# Copy our specific configuration files
# Note: The actual config files will be mounted as volumes in docker-compose.yml

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"] 