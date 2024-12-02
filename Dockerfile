FROM node:20 AS builder

ENV DB_HOST='85.31.236.27'
ENV DB_PORT='3306'
ENV DB_USERNAME='backmapper-api'
ENV DB_PASSWORD='0WilUy56hjyMSwO'
ENV DB_NAME='backmapper'
ENV JWT_SECRET='q453fihja$efza&r'
ENV JWT_EXPIRATION='24h'
ENV PORT=7512

WORKDIR /app
COPY . .

ENV DB_HOST=$DB_HOST

RUN npm install --platform=linux --arch=x64 sharp
RUN npm install bcrypt
RUN npm install
RUN npm run build


EXPOSE 443
EXPOSE 7512

CMD node ./dist/main.js