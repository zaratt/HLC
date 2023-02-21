const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

require('dotenv').config();

const dbConnection = () => {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Database Connection Successfull'))
        .catch(err => console.log('Failed To Connect With Database, \nReason : ' + err.message))
}

module.exports = dbConnection;




