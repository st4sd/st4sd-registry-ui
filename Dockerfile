FROM mirror.gcr.io/node:lts-alpine AS build_stage
COPY . .
RUN yarn install
RUN yarn build

FROM ghcr.io/nginxinc/nginx-unprivileged:alpine-slim
COPY gpl-licenses /gpl-licenses
COPY ./nginx.conf /etc/nginx/nginx.conf
WORKDIR /code
COPY --from=build_stage dist .

EXPOSE 8080:8080
CMD ["nginx", "-g", "daemon off;"]