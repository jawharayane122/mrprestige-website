FROM nginx:alpine

# Copier nginx.conf au bon endroit (config nginx)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers du site dans le dossier web
COPY index.html style.css script.js translations.js fleet.json /usr/share/nginx/html/

# Copier les images des véhicules
COPY images/ /usr/share/nginx/html/images/

# Copier et rendre le script de démarrage exécutable
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]
