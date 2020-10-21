import mongoose from 'mongoose'

const payPeriodSchema = new mongoose.Schema({
  pay: {
    type: String,
    required: true
  },
  remainingBudget: {
    type: String,
    default: "$0.00"
  }
}, {timestamps: true}
)

const PayPeriodModel = mongoose.model('PayPeriod', payPeriodSchema)

export default PayPeriodModel