#!/bin/sh
# Railway injecte $PORT dynamiquement (par défaut 8080)
PORT=${PORT:-8080}

echo "🚀 Démarrage nginx sur le port $PORT"

# Remplacer le port dans la config nginx (gère les espaces variables)
sed -i "s/listen[[:space:]][[:space:]]*80;/listen ${PORT};/g" /etc/nginx/conf.d/default.conf

# Vérifier que la config est OK
nginx -t && nginx -g "daemon off;"
