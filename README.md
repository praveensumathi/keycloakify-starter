docker compose down

docker rmi my-keycloak-theme

yarn run build-keycloak-theme

docker build -t my-keycloak-theme .

docker compose up -d
