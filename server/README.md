# Sever

## Quick Start

### Run locally

To get this project up and running locally on your computer:

1. Set up a [Nodejs](https://wiki.developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/development_environment) development environment.
1. Once you have node setup, enter the following commands in the `server` folder of your clone of this repo:
   ```
   npm install
   DEBUG=express-locallibrary-tutorial:* npm run devstart
   ```
1. Open a browser to http://localhost:3000/ to open the site.

> **Note:** The library uses a default MongoDb database hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). You should use a different database for your own code experiments.

## Run on Docker

1. Make sure Docker and Docker Compose installed
1. Enter the following commands in the `server` folder of your clone of this repo:
   ```
   #Run docker compose
   docker-compose up
   ```
1. Open a browser to http://localhost/ to open the site.
