FROM quay.io/keycloak/keycloak:26.0.5 AS builder

WORKDIR /opt/keycloak

COPY ./dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar /opt/keycloak/providers/

RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:26.0.5

COPY --from=builder /opt/keycloak/ /opt/keycloak/