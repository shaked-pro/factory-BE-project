const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Here I will define the Schema of the shift model

const shiftSchema = new Schema({
  _id: Schema.Types.ObjectId,
  Date : Date,
  Starting_Hour: Number,
  Ending_Hour: Number
});

const Shift = mongoose.model('Shifts', shiftSchema);

module.exports = Shift;
