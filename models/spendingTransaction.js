import mongoose from 'mongoose'

const spendingTransaction = new mongoose.Schema({
  refUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  },
  category: {
    type: String,
    required: true
  }
}, {timestamps: true}
)

const SpendingTransactionModel = mongoose.model('SpendingTransaction', spendingTransaction)

export default SpendingTransactionModel