import express from 'express'
import fixedSpendingModel from '../models/fixedSpending'

const router = express.Router()


router.get('/', getFixedSpendings)

router.get('/by-pay-period', getFixedSpendingsByPayPeriodId)

router.post('/create-fixed-spending', createSpendingTransaction)

router.put('/update-fixed-spending', updateFixedSpending)

router.put('/update-multiple-fixed-spendings', updateMultipleFixedSpendings)

function getFixedSpendings(req, res, next) {
  fixedSpendingModel
  .find()
  .sort("createddAt")
  .exec( (err, data) => {
    if(err) return next(err)
    res.send(data)
  })
}

function getFixedSpendingsByPayPeriodId(req, res, next) {
  const {payPeriodId} = req.query;
  fixedSpendingModel
    .find({ refPayPeriods: {$all:[payPeriodId]} })
    .exec( (err, data) => {
      if(err) return next(err)
      res.send(data)
    })
}

function getFixedSpendingsByPayPeriod(req, res, next) {
  const {payPeriodId} = req.body;
  fixedSpendingModel
    .find()
    .exec( (err, data) => {
      if(err) return next(err)
      res.send(data)
    })
}

function createSpendingTransaction(req, res, next) {
  const {description, amount, payPeriodId} = req.body;

  fixedSpendingModel.create({description, amount, refPayPeriods: [payPeriodId] }, (err, data) => {
    if(err) return next(err)
    res.send(data)
  })  

}

function updateFixedSpending(req, res, next) {

  const { id, description, payPeriodId} = req.body
  fixedSpendingModel
    .findByIdAndUpdate(id, {description, $addToSet: { refPayPeriods: payPeriodId}}, {new: true} )
    .exec( (err, data) => {
      if(err) return next(err)
      res.send(data)
    })
}

function updateMultipleFixedSpendings(req, res,next) {
  const { spendingIds, payPeriodId } = req.body;
  fixedSpendingModel
    .updateMany({ _id: {$in: [...spendingIds]}}, { $push: {refPayPeriods: payPeriodId} } )
    .exec( (err, data) => {
      if(err) return next(err)
      res.send(data)
    } )
}
export default router