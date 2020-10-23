import mongoose from 'mongoose'

const fixedSpending = new mongoose.Schema({
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
    ref: 'PayPeriod',
    required: true
  }]
}, {timestamps: true}
)

const FixedSpendingModel = mongoose.model('FixedSpending', fixedSpending)

export default FixedSpendingModel