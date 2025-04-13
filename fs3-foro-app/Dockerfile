FROM nginx:alpine

# Copiar la build generada desde la carpeta browser
COPY dist/fs3-foro-app/browser/ /usr/share/nginx/html/

# Reemplaza la config por defecto de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
