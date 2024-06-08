const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Here I will define the Schema of the shift model

const shiftSchema = new Schema({
  _id: Schema.Types.ObjectId,
  date : Date,
  starting_hour: Number,
  ending_hour: Number
});

const Shift = mongoose.model('Shift', shiftSchema);

module.exports = Shift;
