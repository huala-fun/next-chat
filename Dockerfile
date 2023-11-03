# base image
FROM node:lts

# create & set working directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# copy source files
COPY . /usr/src

COPY package*.json ./
COPY prisma ./prisma/

RUN apt-get -qy update && apt-get -qy install openssl

# install dependencies
RUN pnpm install
RUN pnpm install @prisma/client
COPY . .
# start app
RUN pnpm run build

EXPOSE 3000
CMD pnpm run start