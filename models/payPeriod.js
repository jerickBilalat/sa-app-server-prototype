import mongoose from 'mongoose'

const payPeriodSchema = new mongoose.Schema({
  refUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pay: {
    type: String,
    required: true
  },
  remainingBudget: {
    type: String,
    default: "0.00"
  }
}, {timestamps: true}
)

const PayPeriodModel = mongoose.model('PayPeriod', payPeriodSchema)

export default PayPeriodModel