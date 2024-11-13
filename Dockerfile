# Etapa de Construcción
FROM node:20-alpine AS build-frontendauth

WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY ./ /app

ARG client_id
ARG client_secret

# Imprime los valores de las variables
RUN echo "client_id: $client_id" && echo "client_secret: $client_secret"

# Imprime el contenido original del archivo
RUN echo "Contenido original de auth.service.ts:" && cat src/app/servicios/auth.service.ts

# Realiza la sustitución
RUN sed -i 's/client_id: "[^"]*"/client_id: "'"$client_id"'"/' src/app/servicios/auth.service.ts && \
    sed -i 's/client_secret: "[^"]*"/client_secret: "'"$client_secret"'"/' src/app/servicios/auth.service.ts

# Imprime el contenido modificado del archivo
RUN echo "Contenido modificado de auth.service.ts:" && cat src/app/servicios/auth.service.ts

# Verifica que los valores se han reemplazado correctamente
RUN echo "Verificando CLIENT_ID en auth.service.ts" && grep "client_id: \"$client_id\"" src/app/servicios/auth.service.ts && \
    echo "Verificando CLIENT_SECRET en auth.service.ts" && grep "client_secret: \"$client_secret\"" src/app/servicios/auth.service.ts && \
    echo "Client ID y Client Secret cambiados correctamente" || \
    (echo "Error: No se encontraron los valores esperados" && exit 1)

RUN npm run build

# Etapa de Servicio
FROM httpd:2.4 AS serve-frontendauth

COPY --from=build-frontendauth /app/dist/blitzvideo-auth/browser /usr/local/apache2/htdocs/

EXPOSE 80

CMD ["httpd-foreground"]

