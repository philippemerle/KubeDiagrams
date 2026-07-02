#! /bin/sh

# Build the KubeDiagrams Frontend image
docker buildx build -t philippemerle/kubediagrams-frontend:latest frontend

# Push the KubeDiagrams Frontend image
docker image push philippemerle/kubediagrams-frontend:latest

# Build the KubeDiagrams Backend image
docker buildx build -t philippemerle/kubediagrams-backend:latest backend

# Push the KubeDiagrams Backend image
docker image push philippemerle/kubediagrams-backend:latest
