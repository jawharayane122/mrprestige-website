FROM nginx:alpine

# Configuration nginx (cache, en-têtes, gzip)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Fichiers du site (voir .dockerignore pour ce qui est exclu)
COPY . /usr/share/nginx/html

# Script de démarrage qui injecte le PORT Railway dans nginx
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]
