FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Expose the port your app will run on
EXPOSE 5001

# Command to run the app
CMD ['npm', 'run', 'dev']
