# Distributed Online Judge

[![Tests](https://github.com/IU-MAP/project-distributed-online-judge/actions/workflows/node.js.yml/badge.svg)](https://github.com/IU-MAP/project-distributed-online-judge/actions/workflows/node.js.yml)

Distributed Online Judge is a distributed computing application for testing programs against test cases in programming competitions.

Table of contents:
- [Team members](#team-members)
- [Why yet another online judge?](#why-yet-another-online-judge)
- [Architecture](#architecture)
- [Technology stack](#technology-stack)
- [Documentation](#documentation)
- [Challenges](#challenges)

## Team members

- Khaled Ismaeel (BS18-SB)
- Trang Nguyen (BS18-DS-01)
- Marko Pezer (BS18-SE-01)
- Kerim Kochekov (BS18-DS-02)

## Why yet another online judge?

Hosting a programming competition is a resource-intensive task. In some rounds on [Codeforces](codeforces.com) the judging servers receive an excess of 100,000 solutions to test, each of which runs on around 50 test cases taking a matter of seconds and sometimes minutes to complete. As a result, competitive programming platforms often require high performance servers to accommodate the huge workload.

Obviously, investing in powerful servers is expensive. Furthermore, this approach is error-prone due to its single point of failure. This has already been demonstrated in numerous online round on Codeforces, where the testing servers would be overloaded or DDoS'ed during competitions and the round would eventually be canceled.

This project is an attempt to port the approach of [Lichess](lichess.org)'s computer analysis feature to competitive programming platforms. Lichess employs a volunteer computing paradigm where volunteers perform game analysis on their local machines and report the results back to Lichess servers. In this paradigm the server is not involved in the computationally-intensive task of analyzing game; only in request processing. This has proved to be extremely reliable for Lichess: analysis is almost instant and perpetually available.

## Architecture

The application cluster consists of 2 types of network nodes:

- **Server** run by the platform administrator.
- **Client** run by a single volunteer.

The server hosts the platform interface to contestants along with all units related to solution testing (test cases, checker, validator, interactor, etc). When the server accepts a solution from a user, it forwards this solution along with testing units (which could be cached) to a volunteer. The client performs the testing protocol and reports the results back to the server, which in turn reports the result back to the contestant. All communication channels (contestant-server, server-volunteer) are to be implemented on top of HTTPS.

![Structure image](images/structure.png)

## Technology stack

**Frontend**

- React JS
- Material UI

**Backend**

- NodeJS
- MongoDB

**Testing environment** (not fully determined)

- Docker
- GDB

**Testing and documentation**

- Jest
- Swagger
- JSDoc

## Documentation

### Server

#### Setup

##### Run locally

To get this project up and running locally on your computer:

1. Set up a [Nodejs](https://wiki.developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/development_environment) development environment.
1. Once you have node setup, enter the following commands in the root of your clone of this repo:
   ```
   #Go to server directory
   cd server

   #Install dependencies
   npm install

   #Start development server 
   npm run devstart
   ```
1. Open a browser to http://localhost:3000/ to open the site.

> **Note:** The library uses a default MongoDb database hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). You should use a different database for your own code experiments.

##### Run on Docker

1. Make sure Docker and Docker Compose installed
1. Enter the following commands in the root of your clone of this repo:
   ```
   #Go to server directory
   cd server

   #Run docker compose
   docker-compose up
   ```
1. Open a browser to http://localhost/ to open the site.

#### APIs

Once you have the server run on your machine (locally or using Docker), APIs are documented under `/api-docs/` path using `Swagger`.

![API Docs Screenshot](images/api-docs-screenshot.png)

![API Test Screenshot](images/test-screenshot.png)

Following is the documentation for our server's frontend.

| HTML Verb | URL | Description |
|-----------|-----|-------------|
| GET | /ui/problems | Display all available problems |
| GET | /ui/problems/create | Show form to make new problem |
| POST | /ui/problems/create | Add new problem to database and redirect |
| GET | /ui/problems/:id | Show info about one problem |
| GET | /ui/solutions | Display all available solutions |
| GET | /ui/solutions/create | Show form to make new solution |
| POST | /ui/solutions/create | Add new solution to database and redirect |
| GET | /api-docs/ | Show API documentation|


### Client

#### Run locally

To get this project up and running locally on your computer:

1. Set up a [Nodejs](https://wiki.developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/development_environment) development environment.
1. Once you have node setup, enter the following commands in the root of your clone of this repo:
   ```
   #Go to server directory
   cd client

   #Install dependencies
   npm install

   #Connect to server
   npm run devstart
   ```
#### Run on Docker

To be set up

## Project

Project progress and planning can be found on GitHub projects page.
