import mongoose from 'mongoose'

const spendingTransaction = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  refPayPeriod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PayPeriod',
    required: true
  }
}, {timestamps: true}
)

const SpendingTransactionModel = mongoose.model('SpendingTransaction', spendingTransaction)

export default SpendingTransactionModel