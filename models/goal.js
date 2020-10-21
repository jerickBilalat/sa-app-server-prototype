import mongoose from 'mongoose'

const goal = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: String,
    required: true
  },
  refPayPeriods: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PayPeriod'
  }]
}, {timestamps: true}
)

const GoalModel = mongoose.model('Goal', goal)

export default GoalModel