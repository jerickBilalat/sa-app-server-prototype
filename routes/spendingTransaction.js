import express from 'express'
import spendingTransactionModel from '../models/spendingTransaction'

const router = express.Router()


router.get('/', getAllSpendingTransactions)

router.get('/by-pay-period', getSpendingTransactionsByPayPeriod)

router.post( '/create-spending-transaction', createSpendingTransaction)


function getAllSpendingTransactions(req, res, next) {
  spendingTransactionModel
  .find()
  .sort("createddAt")
  .exec( (err, data) => {
    if(err) return next(err)
    res.send(data)
  })
}

function getSpendingTransactionsByPayPeriod(req, res, next) {
  const {payPeriodId} = req.query;
  spendingTransactionModel
    .find({refPayPeriod: payPeriodId })
    .exec( (err, data) => {
      if(err) return next(err)
      res.send(data)
    })
}

function createSpendingTransaction(req, res, next) {
  const {description, amount, payPeriodId} = req.body;

  spendingTransactionModel.create({description, amount, refPayPeriod: payPeriodId }, (err, data) => {
    if(err) return next(err)
    res.send(data)
  })  

}

export default router