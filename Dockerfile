FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY config.js /usr/src/app
COPY . /usr/src/app
EXPOSE 8383
CMD [ "npm", "start" ]