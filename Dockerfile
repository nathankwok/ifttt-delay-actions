FROM node:slim

ARG webhooks={\"webhooks_id\":\"4XhGCxgB0_BsyfT7hZEPk\"}
ENV WEBHOOKS=$webhooks

ARG delay_minutes=20
ENV DELAY_MINUTES=$delay_minutes

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE $PORT

CMD ["node", "server.js" ]



