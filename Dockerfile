FROM nginx:latest
COPY index.html /usr/share/nginx/html/index.html
COPY script.js /usr/share/nginx/html/script.js
COPY gauge.min.js /usr/share/nginx/html/gauge.min.js