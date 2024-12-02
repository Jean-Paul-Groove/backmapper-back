FROM node:18-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

FROM node:18-alpine

COPY --from=builder /app/dist /

EXPOSE 443

CMD ["node", "main.js"]