# Distributed Online Judge

Distributed Online Judge is a distributed computing application for testing programs against test cases in programming competitions.

## Why yet another online judge?

Hosting a programming competition is a resource-intensive task. In some rounds on [Codeforces](codeforces.com) the judging servers receive an excess of 100,000 solutions to test, each of which runs on around 50 test cases taking a matter of seconds and sometimes minutes to complete. As a result, competitive programming platforms often require high performance servers to accommodate the huge workload.

Obviously, investing in powerful servers is expensive. Furthermore, this approach is error-prone due to its single point of failure. This has already been demonstrated in numerous online round on Codeforces, where the testing servers would be overloaded or DDoS'ed during competitions and the round would eventually be canceled.

This project is an attempt to port the approach of [Lichess](lichess.org)'s computer analysis feature to competitive programming platforms. Lichess employs a volunteer computing paradigm where volunteers perform game analysis on their local machines and report the results back to Lichess servers. In this paradigm the server is not involved in the computationally-intensive task of analyzing game; only in request processing. This has proved to be extremely reliable for Lichess: analysis is almost instant and perpetually available.

## Architecture

The application cluster consists of 2 types of network nodes:

- **Server** run by the platform administrator.
- **Client** run by a single volunteer.

The server hosts the platform interface to contestants along with all units related to solution testing (test cases, checker, validator, interactor, etc). When the server accepts a solution from a user, it forwards this solution along with testing units (which could be cached) to a volunteer. The client performs the testing protocol and reports the results back to the server, which in turn reports the result back to the contestant. All communication channels (contestant-server, server-volunteer) are to be implemented on top of HTTPS.

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

## Challenges

Yet to be written.

## Project

Project progress and planning can be found on GitHub projects page.