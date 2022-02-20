FROM node:12
EXPOSE 4200
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm build
ENTRYPOINT ["npm", "run", "start"]
