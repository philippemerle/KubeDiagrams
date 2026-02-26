FROM docker.io/alpine/helm:3 AS helm

FROM docker.io/python:3.13-alpine AS base
RUN apk update && apk add graphviz bash
RUN apk add --no-cache build-base graphviz-dev
RUN pip install --upgrade pip && pip install PyYAML diagrams graphviz2drawio
RUN apk del build-base graphviz-dev
ADD bin /usr/local/bin/
COPY --from=helm /usr/bin/helm /usr/local/bin/helm
WORKDIR /work
