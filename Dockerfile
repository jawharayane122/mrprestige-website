FROM nginx:alpine

# Copier les fichiers du site
COPY . /usr/share/nginx/html

# Copier le script de démarrage qui injecte le PORT Railway dans nginx
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]
