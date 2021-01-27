FROM node:14
WORKDIR /home/node/app

COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "npm", "start"]
