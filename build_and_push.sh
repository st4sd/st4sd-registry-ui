#!/bin/bash

set -e

#TODO: add validation on input params
yarn build
docker login -u "$DOCKER_USER" -p "$DOCKER_PASS" "$DOCKER_REGISTRY"
docker buildx create --use --driver-opt=image=mirror.gcr.io/moby/buildkit
docker buildx build --platform linux/amd64,linux/arm64,linux/ppc64le --push -t $1 .