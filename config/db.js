const mongoose = require('mongoose');

const connectDB = async() => {
  // Connect to MongoDB database
  await mongoose
    .connect('mongodb://localhost:27017/Factory', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }) 
    .then(() => console.log('Connected to DB'))
    .catch((error) => console.log(error));
};

module.exports = connectDB;
