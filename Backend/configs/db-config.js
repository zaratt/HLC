const mongoose = require('mongoose');

mongoose.set('strictQuery', false);


const dbConnection = () => {
    mongoose.connect('mongodb://localhost:27017/colih_app_local')
        .then(() => console.log('Database Connection Successfull'))
        .catch(err => console.log('Failed To Connect With Database, \nReason : ' + err.message))
}

module.exports = dbConnection;




//mongodb+srv://colih_app:YOBSD3RewshmTsIf@cluster1.khyglzb.mongodb.net/colih_db?retryWrites=true&w=majority