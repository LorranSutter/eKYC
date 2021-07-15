<h1 align="center">
   <img src="https://res.cloudinary.com/lorransutter/image/upload/v1626387244/eKYC/eKYC_logo.svg" height=150/>
   <p>eKYC</p>
</h1>

<p align="center">
   Blockchain solution for sharing customer KYC information, using Hyperledger Fabric, Node.js and ReactJS. Presented as final assingment for BCDV1012 - dApp I from <a href='https://www.georgebrown.ca/programs/blockchain-development-program-t175/'>Blockchain Development</a> program from <a href='https://www.georgebrown.ca'>George Brown College</a>.
</p>

<p align="center">
   For architecture, flow diagrams and more detailed explanation, please check <a href='Project%20Documents/Architecture%20Design%20%26%20Governance%20Document%20-%20eKYC%20-%20dAPP%201.pdf'>Project Documents</a> folder.
</p>

<p align="center">
    <a href="https://github.com/Nas2020">Cherukkatil Naseer</a>&nbsp;|&nbsp;
    <a href="https://github.com/TheClockworkOrange">Henry Eriko Mwenge</a>&nbsp;|&nbsp;
    <a href="https://github.com/LorranSutter">Lorran Sutter</a>&nbsp;|&nbsp;
    <a href="https://github.com/pumpin100">Raymond Lawal</a>&nbsp;|&nbsp;
    <a href="https://github.com/mascarenhaswanja">Wanja Mascarenhas</a>&nbsp;|&nbsp;
    <a href="https://github.com/DeadPreZ-101">Zakariya Jasat</a>
</p>

<p align="center">
  
  <img src="https://res.cloudinary.com/lorransutter/image/upload/v1594527234/eKYC/eKYC-2.0_1.gif" height=400/>
  <img src="https://res.cloudinary.com/lorransutter/image/upload/v1594528007/eKYC/eKYC-2.0_2.gif" height=400/>
  
</p>

## :runner: How to run

This project was developed using a [Google Cloud Platform](https://cloud.google.com/) virtual machine, so every step must be performed in a VM CLI under a _sudo -s_ command.

Start your VM and save the highlighted External IP:

<p align="center">
   <img src="https://res.cloudinary.com/lorransutter/image/upload/v1594076924/eKYC/VM.png"/>
</p>

You must have [Fabric samples](https://github.com/hyperledger/fabric-samples) to run this project. You will clone this project inside fabric-samples folder so as to this can use the files from bin and config folders.

Here you can see the folder structure and the main files mentioned in this section:

```
📦fabric-samples
 ┣ 📂bin
 ┣ 📂config
 ┗ 📂eKYC
   ┣ 📂api
   ┣ 📂chaincode
   ┣ 📂frontend
      ┗ 📂src
         ┗ 📂service
            ┗ 📜baseURL.json
   ┣ 📂test-network
   ┣ 📜.env
   ┣ 📜networkDown.sh
   ┗ 📜setUp.sh
```

Open your terminal in the fabric-samples folder and clone the project.

``` sh
# Clone this repo
git clone https://github.com/LorranSutter/eKYC.git

# Go to the project folder
cd eKYC
```

To run the application you will need to set your own configurations of _port_, _database_, _private key_ and _encryption key_. Create the following .env file in the indicated path and format with your customized configurations:

``` json
// ./.env

PORT_API=5000
PRIVATE_KEY="54AD766F231CCB0EA64156F1E5488"
ENCRYPTION_KEY="CoCKidLqlVuB8y1EYmKaye1UGoxtHmko1LmyqOHvVht="
MONGODB_URI_DEV="YOUR_DEV_MONGO_URI"
```

Now you will need two opened terminals to run the project. One for the API and another one for the frontend.

API will run on http://35.193.245.108:5000/

Frontend will run on http://35.193.245.108:3000/

``` sh

## In the first terminal ##

# Go to the chaincode folder
cd chaincode

# Install dependencies
npm install

# Go to the API application
cd ../api

# Install dependencies
npm install
```

``` sh
## In the second terminal ##

# Go to the frontend application
cd frontend

# Install dependencies
npm install
```

In order to connect frontend to the API, you will have to provide the base URL of the API in the following file:

```sh
## In the second terminal ##

# Go to the baseURL.json file
cd src/service/baseURL.json

{
    "baseURL": "http://35.193.245.108:5000"
}
```

Now you can start the network and perform all necessary set up running the following magic script:

``` sh
## In the first terminal ##

# Go to the root
cd ..

# Run the set up script
./setUp.sh
```

Run the API application:

``` sh
## In the first terminal ##

# Go to the API application
cd api

# Run API application
npm run start

# Or to use nodemon
npm run dev
```

Finally run the frontend application:

``` sh
## In the second terminal ##

# Run the project
npm start
```

If you want to stop the network and delete all artifacts created, just run the next magic script below:

``` sh
## In the first terminal ##

# Go to the root
cd ..

# Run the script
./networkDown.sh
```

#### Login credentials

Client
* login: user01 / user02 / JonasKahnwald / MarthaNielsen / ClaudiaTiedemann / ElisabethDoppler / H.G.Tannhaus
* password: 123456

Financial Institution
* login: FI1 / FI2
* password: 123456

## :book: Resources and technologies :computer:

1. Chaincode

   - [Fabric samples](https://github.com/hyperledger/fabric-samples) - get started samples for Hyperledger Fabric
   - [Fabric contract API](https://www.npmjs.com/package/fabric-contract-api) - contract interface to implement smart contracts
   - [ESlint](https://eslint.org/) - pluggable JS linter

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

   - [Rimble](https://rimble.consensys.design/) - design system
   - [ReactJS](https://reactjs.org/) - frontend library
   - [React router dom](https://www.npmjs.com/package/react-router-dom) - routing and navigation for react apps
   - [React-cookie](https://www.npmjs.com/package/react-cookie) - cookie interaction for React applications
   - [Axios](https://www.npmjs.com/package/axios) - HTTP requests

## :cookie: Credits

- [Encryption/Decryption code using cipher](https://github.com/zishon89us/node-cheat/blob/master/stackoverflow_answers/crypto-create-cipheriv.js#L2)
