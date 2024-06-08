const mongoose = require('mongoose');
// Here I will define the Schema of the user model

const userSchema = mongoose.Schema({
  id :{type:ObjectId , required:true},
  full_name: String,
  num_of_actions: Number
});
