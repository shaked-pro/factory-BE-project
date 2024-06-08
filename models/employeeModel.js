const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Here I will define the Schema of the employee model

const employeeSchema = new Schema({
  _id : Schema.Types.ObjectId,
  First_Name: String,
  Last_Name : String,
  Start_Work_Year : Number,
  Department_id: Schema.Types.ObjectId
  }, {
    toJSON: { virtuals: true } // Include virtuals when document is converted to JSON
});

// Virtual for full name
employeeSchema.virtual('fullName').get(function () {
  return (this.First_Name + ' ' + this.Last_Name);
});

const Employee = mongoose.model('employees', employeeSchema);

module.exports=Employee;
