# Blitzvideo-Auth

<p align="center">
    <img src="https://drive.google.com/uc?export=download&id=1yyVoEHmLQgzYpDJJJvjtpo1MHdZNP84k" width="200">
</p>

### Configuración del proyecto

-   Para comenzar, clona el repositorio de GitHub a tu máquina local. Abre una terminal y ejecuta el siguiente comando:

`Vía SSH:`

```
git clone git@github.com:blitzcode-company/Blitzvideo-Auth.git
```

`Vía HTTPS:`

```
git clone https://github.com/blitzcode-company/Blitzvideo-Auth.git
```

-   Ingresamos al proyecto `cd Blitzvideo-Auth` y ejecutamos:

```
npm install
```
-   Colocamos las CLIENT_ID y CLIENT_SECRET en el docker compose en 

```
  args:
        client_id: "client_id_generada"
        client_secret: "client_secret_generada"
```

-   Generamos el contenedor de Blitzvideo-Auth con:

```
docker compose up -d
```

- El contenedor se abrira en el puerto 3002 en


```
localhost:3002
```
