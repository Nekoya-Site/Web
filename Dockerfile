FROM node:16.20

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install
RUN npm ci --omit=dev

# Bundle app source
COPY . .

ARG PORT
EXPOSE ${PORT}

CMD [ "node", "index.js" ]