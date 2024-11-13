#!/bin/bash

CONTAINER_NAME="mysql"
MYSQL_CMD="mysql -u root -proot -D Blitzvideo -se \"SELECT secret FROM oauth_clients WHERE id = 1;\""
CLIENT_SECRET=$(sudo docker exec -ti $CONTAINER_NAME bash -c "$MYSQL_CMD" | tail -n 1 | tr -d '\r')
COMPOSE_FILE="docker-compose.yml"
if [[ -f "$COMPOSE_FILE" ]]; then
    sed -i "s/client_secret:/client_secret: \"$CLIENT_SECRET\"/" "$COMPOSE_FILE"
    echo "Actualizado $COMPOSE_FILE con client_secret: $CLIENT_SECRET"
else
    echo "Archivo $COMPOSE_FILE no encontrado."
fi


