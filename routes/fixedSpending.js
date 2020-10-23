import express from 'express'
import fixedSpendingModel from '../models/fixedSpending'
import mongoose from 'mongoose'
import requierSignin from '../middlewares/requireSignIn'

const router = express.Router()


router.get('/', requierSignin, getFixedSpendings)

router.get('/by-pay-period', requierSignin, getFixedSpendingsByPayPeriodId)

router.post('/create-fixed-spending', requierSignin, createFixedSpending)

router.put('/update-fixed-spending', requierSignin, updateFixedSpending)

router.put('/update-multiple-fixed-spendings', requierSignin, updateMultipleFixedSpendings)

function getFixedSpendings(req, res, next) {
  fixedSpendingModel
  .find({refUser: req.user.id})
  .sort("createddAt")
  .exec( (err, data) => {
    if(err) return next(err)
    res.send(data)
  })
}

function getFixedSpendingsByPayPeriodId(req, res, next) {
  const {payPeriodId} = req.query;
  fixedSpendingModel
    .find({ refPayPeriods: {$all:[payPeriodId]}, refUser: req.user.id })
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

function createFixedSpending(req, res, next) {
  const {description, amount, payPeriodId} = req.body;

  fixedSpendingModel.create({description, amount, refPayPeriods: [payPeriodId], refUser: mongoose.Types.ObjectId(req.user.id) }, (err, data) => {
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