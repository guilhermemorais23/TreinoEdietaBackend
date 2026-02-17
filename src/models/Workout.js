const mongoose = require('mongoose')

const WorkoutSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: String,
  duration: Number,
  notes: String,
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Workout', WorkoutSchema)
