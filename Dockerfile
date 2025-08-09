# build container
FROM node:24-alpine

WORKDIR /app

COPY ./package.json .
COPY ./yarn.lock .

RUN yarn install

COPY ./tsconfig.json .
COPY ./src .

ARG db_host=$db_host
ARG db_user=$db_user
ARG db_password=$db_password

ENV DB_HOST=$db_host
ENV DB_USER=$db_user
ENV DB_PASSWORD=$db_password
ENV PORT=5000

ENV NODE_ENV=production
ENV HOST=0.0.0.0

RUN yarn build

EXPOSE 5000

CMD ["yarn", "start"]
