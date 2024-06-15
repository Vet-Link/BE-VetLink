FROM node:20

workdir /src

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=8000
ENV SECRETKEY=awooogaaa
ENV HOST=ardyprasyah2653@gmail.com
ENV PASS=hqifquhyaounusmt
ENV SALT=10

EXPOSE 8080

CMD ["npm", "start"]