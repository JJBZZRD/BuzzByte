#!/bin/bash

# Create necessary directories if they don't exist
mkdir -p ../logs/nginx
mkdir -p ../nginx/certbot/conf
mkdir -p ../nginx/certbot/www

# Build and start the containers
docker-compose up -d --build

echo "BuzzByte is now running!"
echo "Access the application at http://localhost"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop the application:"
echo "  docker-compose down" 