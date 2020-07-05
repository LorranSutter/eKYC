const app = require('./app');

const InitiateMongoServer = require('./db/connection');
const mongoURI = process.env.MONGODB_URI_DEV;

InitiateMongoServer(mongoURI);

app.listen(process.env.PORT_API || 5000);