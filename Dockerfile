FROM node:20 AS builder

WORKDIR /app
COPY . .
ARG DB_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_NAME
ARG JWT_SECRET
ARG JWT_EXPIRATION
ARG PORT

ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV DB_USERNAME=$DB_USERNAME
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_NAME=$DB_NAME
ENV JWT_SECRET=$JWT_SECRET
ENV JWT_EXPIRATION=$JWT_EXPIRATION
ENV PORT=$PORT

RUN npm install --platform=linux --arch=x64 sharp
RUN npm install bcrypt
RUN npm install
RUN npm run build


EXPOSE 443
EXPOSE 7512

CMD node ./dist/main.js