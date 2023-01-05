ARG BASE_BUILD_IMAGE=node:18-slim
ARG BASE_RUN_IMAGE=gcr.io/distroless/nodejs18-debian11

# Build stage 1 - install build and (frozen) app dependencies
FROM $BASE_BUILD_IMAGE as build

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package*.json ./

COPY . .

RUN npm install --only=production




# Build stage 2 - include only app dependencies and source
FROM $BASE_RUN_IMAGE

ARG default_delay_minutes=20
ENV DEFAULT_DELAY_MINUTES=$default_delay_minutes

ARG default_port=8080
ENV PORT=$default_port

WORKDIR /usr/src/app

COPY --from=build /app .
COPY server.js server.js

EXPOSE $PORT

CMD ["server.js" ]



