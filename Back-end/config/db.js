const mongoose = require('mongoose');

const connect = () => {
    mongoose.connect('mongodb://localhost:27017/loan-app', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('MongoDB connected');
    }).catch((err) => {
        console.error('MongoDB connection error:', err);
    });
};

module.exports = { connect };
