import express from 'express'
import spendingTransactionModel from '../models/spendingTransaction'
import mongoose from 'mongoose'
import requierSignin from '../middlewares/requireSignIn'

const router = express.Router()


router.get('/', requierSignin, getAllSpendingTransactions)

router.get('/by-pay-period', requierSignin, getSpendingTransactionsByPayPeriod)

router.post( '/create-spending-transaction', requierSignin, createSpendingTransaction)


function getAllSpendingTransactions(req, res, next) {
  spendingTransactionModel
  .find({refUser: req.user.id})
  .sort("createddAt")
  .exec( (err, data) => {
    if(err) return next(err)
    res.send(data)
  })
}

function getSpendingTransactionsByPayPeriod(req, res, next) {
  const {payPeriodId} = req.query;
  spendingTransactionModel
    .find({refPayPeriod: payPeriodId, refUser: req.user.id})
    .exec( (err, data) => {
      if(err) return next(err)
      res.send(data)
    })
}

function createSpendingTransaction(req, res, next) {
  const {description, amount, payPeriodId} = req.body;

  spendingTransactionModel.create({description, amount, refPayPeriod: payPeriodId, refUser: mongoose.Types.ObjectId(req.user.id) }, (err, data) => {
    if(err) return next(err)
    res.send(data)
  })  

}

export default router