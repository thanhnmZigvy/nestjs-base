FROM node:20-alpine 

ENV NODE_OPTIONS=--max_old_space_size=4096
ENV NODE_ENV="staging"

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3001

CMD ["yarn", "start"]