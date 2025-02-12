#!/bin/bash

set -e

#TODO: add validation on input params
yarn build
docker login -u "$DOCKER_USER" -p "$DOCKER_PASS" "$DOCKER_REGISTRY"
docker buildx build --push -t $1 .