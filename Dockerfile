FROM node:10
WORKDIR /adnymics/app
COPY package*.json ./
RUN npm install
COPY . .
#RUN npm run test
RUN node index.js