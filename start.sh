#!/bin/sh
# Railway injecte $PORT dynamiquement (souvent 8080)
PORT=${PORT:-8080}

# Remplacer le port dans la config nginx
sed -i "s/listen 80;/listen ${PORT};/" /etc/nginx/conf.d/default.conf

echo "🚀 Démarrage nginx sur le port $PORT"
nginx -g "daemon off;"
