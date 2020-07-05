<h1 align="center">
   eKYC
</h1>

<p align="center">
   Blockchain solution for sharing customer KYC information, using Hyperledger Fabric, Node.js and ReactJS. Presented as final assingment for BCDV1012 - dApp I from <a href='https://www.georgebrown.ca/programs/blockchain-development-program-t175/'>Blockchain Development</a> program from <a href='https://www.georgebrown.ca'>George Brown College</a>.
</p>

<p align="center">
  
  <img src="https://res.cloudinary.com/lorransutter/image/upload/v1593367650/eKYC/State_diagram.png"/>
  
</p>

<p align="center">
    <a href="https://github.com/Nas2020">Cherukkatil Naseer</a>&nbsp;|&nbsp;
    <a href="https://github.com/TheClockworkOrange">Henry Eriko Mwenge</a>&nbsp;|&nbsp;
    <a href="https://github.com/LorranSutter">Lorran Sutter</a>&nbsp;|&nbsp;
    <a href="https://github.com/pumpin100">Raymond Lawal</a>&nbsp;|&nbsp;
    <a href="https://github.com/mascarenhaswanja">Wanja Mascarenhas</a>&nbsp;|&nbsp;
    <a href="https://github.com/DeadPreZ-101">Zakariya Jasat</a>
</p>

## :runner: How to run

Open your terminal in the folder you want to clone the project

``` sh
# Clone this repo
git clone https://github.com/LorranSutter/eKYC.git

# Go to the project folder
cd eKYC
```

To run the application you will need to set your own configurations of _port_, _database_ and _private key_. Create the following .env file in the indicated path and format with your customized configurations:

``` json
// ./.env

PORT_API=5000
PRIVATE_KEY="YOUR_STRONG_PRIVATE_KEY"
MONGODB_URI_DEV="YOUR_DEV_MONGO_URI"
```

<!-- Now you will need three opened terminals to run the project. One for truffle to simulate the EVM, another one for the server and a third one for the frontend.

Truffle will run on http://127.0.0.1:9545/

Server will run on http://localhost:5000/

Frontend will run on http://localhost:3000/ -->

<!-- 

``` sh

## In the first terminal ##

# Go to smart contract folder
cd smart_contract

# Init truffle
truffle develop

# Run migrations
migrate
```

The previous command will generate a new ABI and write contract address in a JSON file. You do not have to worry about importing these info in the backend though. Also you may change the smart contract and run migrations again to see your changes.

If you change your contract, you will have to run migrations again. Just type the following command:

``` sh
# Run migrations again
migrate --reset
```

Install backend dependencies:

``` sh

## In the other terminal ##

# Go to backend application
cd backend

# Install dependencies
npm install
```

To kick-start application data, you can run _populate_ script, which will write basic data in truffle develop blockchain environment and database:

``` sh
npm run populate
```

Run the backedn application:

``` sh
# Run backend application
npm run start

# Or to use nodemon
npm run dev
```

Finally run the frontend application:

``` sh

## In the third terminal ##

# Go to frontend application
cd frontend

# Install dependencies
npm install

# Run the project
npm run start
```

#### Login credentials

* username: distributor
* password: 123456

### :syringe: Tests

Both Smart Contract and backend application have its own tests suite. To run the tests execute the following commands: -->

<!-- ```sh

# Smart Contracts folder

cd smart_contracts

# Run tests

truffle test

# Backend folder

cd backend

# Run tests

npm run test
``` -->

## :book: Resources and technologies :computer:

1. Chaincode

   - [Fabric samples](https://github.com/hyperledger/fabric-samples) - get started samples for Hyperledger Fabric
   - [Fabric contract API](https://www.npmjs.com/package/fabric-contract-api) - contract interface to implement smart contracts

2. API

   - [Express.js](http://expressjs.com/) - web application framework
   - [MongoDB](https://www.mongodb.com/) - NoSQL database
   - [Mongoose](https://mongoosejs.com/) - object data modeling (ODM) library for MongoDB and Node.js
   - [Async](https://caolan.github.io/async/v3/) - library to perform asynchronous operations
   - [Express validator](https://express-validator.github.io/docs/) - middleware to validate data
   - [Bcryptjs](https://www.npmjs.com/package/bcryptjs) - library to perform cryptography
   - [JWT. IO](https://jwt.io/) - JSON Web Tokens to allow, decode, verify and generate JWT
   - [Dotenv](https://www.npmjs.com/package/dotenv) - loads environment variables from a .env file
   - [Fabric CA Client](https://www.npmjs.com/package/fabric-ca-client) - SDK for Node.js to interact with HLF CA
   - [Fabric Network](https://www.npmjs.com/package/fabric-network) - SDK for Node.js to interact with HLF

3. Frontend

   <!-- - [Rimble](https://rimble.consensys.design/) - design system -->
   - [ReactJS](https://reactjs.org/) - frontend library
   - [React router dom](https://www.npmjs.com/package/react-router-dom) - routing and navigation for react apps
   - [React-cookie](https://www.npmjs.com/package/react-cookie) - cookie interaction for React applications
   - [Axios](https://www.npmjs.com/package/axios) - HTTP requests
