const mongoose = require('mongoose')

const MealSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Meal', MealSchema)
