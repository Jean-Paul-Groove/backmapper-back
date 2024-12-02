FROM node:18 AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm install --platform=linux --arch=x64 sharp
RUN npm install bcrypt
RUN npm run build


EXPOSE 443
EXPOSE 7512

CMD node ./dist/main.js