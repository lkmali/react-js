# Check out https://hub.docker.com/_/node to select a new base image
FROM mhart/alpine-node:latest as LKMALI_WEB_IMAGE


WORKDIR /usr/src/web

COPY . .


RUN yarn install --ignore-engines

RUN yarn build

FROM mhart/alpine-node:latest

RUN addgroup -g 1000 node \
  && adduser -u 1000 -G node -s /bin/sh -D node \
  && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Set to a non-root built-in user `node`
USER node

WORKDIR /usr/src/web


COPY --chown=node:node --from=LKMALI_WEB_IMAGE /usr/src/web/pm2.json /usr/src/web/pm2.json
COPY --chown=node:node --from=LKMALI_WEB_IMAGE /usr/src/web/node_modules /usr/src/web/node_modules
COPY --chown=node:node --from=LKMALI_WEB_IMAGE /usr/src/web/build /usr/src/web/build
COPY --chown=node:node --from=LKMALI_WEB_IMAGE /usr/src/web/index.js /usr/src/web/index.js
# Start Server
ENTRYPOINT ./node_modules/.bin/pm2-runtime start ./pm2.json --env $NODE_ENV

EXPOSE ${REACT_APP_PORT}
