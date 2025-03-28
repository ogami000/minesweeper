FROM node:18-alpine

RUN apk update && \
  apk upgrade && \
  apk add --no-cache vim bash

COPY ./ /frontend/
WORKDIR /frontend
