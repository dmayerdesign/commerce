FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Build the app
COPY . .
RUN npm run qb build ui development
RUN npm run qb build server development

COPY .vars ./

RUN chmod +x /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/.vars

EXPOSE 4300

ENTRYPOINT [ "/usr/src/app/entrypoint.sh" ]
CMD [ "npm", "run", "start" ]
