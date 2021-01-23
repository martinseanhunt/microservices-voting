FROM node:alpine

WORKDIR /app
COPY package.json .
# RUN yarn install --only=prod
RUN yarn install
COPY . .

CMD ["yarn", "start"]
