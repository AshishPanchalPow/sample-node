FROM node:19.4-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# RUN --mount=type=cache,target=/usr/sr/app/.npm \
#     npm set cache /usr/src/app/.npm && \
#     npm ci --only=production

USER node

COPY --chown=node:node ./src/ .

EXPOSE 3000

CMD [ "node", "index.js" ]