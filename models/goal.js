import mongoose from 'mongoose'

const goal = new mongoose.Schema({
  refUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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