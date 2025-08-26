FROM node:18-alpine

RUN apk update && \
  apk upgrade && \
  apk add --no-cache vim bash

WORKDIR /frontend

COPY ./ /frontend/
