FROM docker.io/alpine/helm:3 AS helm

FROM docker.io/python:3.13-alpine AS base
RUN apk add --no-cache graphviz bash
RUN apk add --no-cache --virtual .build-deps build-base graphviz-dev \
    && pip install --no-cache-dir PyYAML diagrams pygraphviz==1.14 graphviz2drawio \
    && apk del .build-deps
ADD bin /usr/local/bin/
COPY --from=helm /usr/bin/helm /usr/local/bin/helm
WORKDIR /work
