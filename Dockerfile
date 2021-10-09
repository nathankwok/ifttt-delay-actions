FROM node:slim

ENV WEBHOOKS={\"webhooks_id\":\"4XhGCxgB0_BsyfT7hZEPk\"}
ENV DELAY_MINUTES=20

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



