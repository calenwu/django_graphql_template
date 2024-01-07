FROM node:21-alpine3.17
WORKDIR /apps/nextjs

COPY ./apps/nextjs /apps/nextjs

RUN npm install
CMD ["npm", "run", "dev"]