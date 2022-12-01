#!/bin/bash

#TODO: add validation on input params
yarn build
docker login -u $DOCKER_USER -p $DOCKER_PASS $DOCKER_REGISTRY
docker run --privileged --rm res-st4sd-team-official-base-docker-local.artifactory.swg-devops.com/mirror/tonistiigi/binfmt --install arm64,ppc64le
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64,linux/ppc64le --push -t $1 .