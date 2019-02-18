FROM node:10

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Build the app
COPY . .
RUN ./qb build --env=production --skip-tests

RUN chmod +x /app/dist/server/server/src/main.js

EXPOSE 8080

CMD [ "npm", "run", "start" ]
