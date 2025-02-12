#!/bin/bash

set -e

docker login -u "$DOCKER_USER" -p "$DOCKER_PASS" "$DOCKER_REGISTRY"
docker buildx build --push -t $1 .