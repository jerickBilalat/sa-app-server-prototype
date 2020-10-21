import mongoose from 'mongoose'
import currency from 'currency.js'

const emergencyFundSchema = new mongoose.Schema({
  type: {
    type: Number,
    default: 3
  },
  remainingBalance: {
    type: String,
    default: "$0.00"
  },
  averagePayPerPeriod: {
    type: String,
    required: true
  },
  numberOfPayPeriodPerMonth: {
    type: Number,
    required: true,
    default: 2
  },
  commitmentAmount: {
    type: String,
    default: "$0.00"
  }
}, {timestamps: true}
)

// emergencyFundSchema.virtual('goalAmount').get( function() {
//   return currency(this.averagePayPerPeriod).multiply(this.type * this.numberOfPayPeriodPerMonth).format()
// })

const EmergencyFundModel = mongoose.model('EmergencyFund', emergencyFundSchema)

export default EmergencyFundModel