const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Here I will define the Schema of the department model

const departmentSchema = new Schema({
  _id: Schema.Types.ObjectId,
  Department_Name: String,
  Department_Manager: Schema.Types.ObjectId //referance to employee id , will add later.
});


const Department = mongoose.model('departments', departmentSchema);

module.exports =Department;
