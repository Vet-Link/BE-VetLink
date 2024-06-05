FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=8000
ENV SECRETKEY=
ENV HOST=
ENV PASS=

CMD ["npm", "start"]