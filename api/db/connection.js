const mongoose = require('mongoose');

const InitiateMongoServer = async (mongoURI) => {
    try {
        await mongoose.connect(mongoURI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        });
        const db = mongoose.connection;

        //Bind connection to error event (to get notification of connection errors)
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = InitiateMongoServer;