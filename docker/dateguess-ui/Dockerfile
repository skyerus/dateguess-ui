FROM node:14-alpine3.11 AS base

FROM base AS dev

WORKDIR /dateguess-ui

COPY ./         ./

CMD ["npm", "start"]

FROM base AS build

WORKDIR /dateguess-ui

COPY ./         ./

RUN npm run build

FROM nginx:alpine AS prod

RUN addgroup -g 3000 -S app
RUN adduser -u 3000 -S -D -G app app

COPY docker/dateguess-ui/site.conf /etc/nginx/conf.d/default.conf
COPY docker/dateguess-ui/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /dateguess-ui/dist /app/dist

WORKDIR /app
