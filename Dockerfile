FROM node:18

WORKDIR /showcase-react/

COPY public/ /showcase-react/public
COPY src/ /showcase-react/src
COPY package.json /showcase-react/

RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]