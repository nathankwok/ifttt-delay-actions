FROM node:slim

ARG default_delay_minutes=20
ENV DEFAULT_DELAY_MINUTES=$delay_minutes

ENV PORT=$PORT

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



