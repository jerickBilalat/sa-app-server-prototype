import express from 'express'
import payPeriodModel from '../models/payPeriod'
import currency from 'currency.js'
import mongoose from 'mongoose'
import fixedSpendingModel from '../models/fixedSpending'
import goalModel from '../models/goal'
import emrFundModel from '../models/emergencyFund'
import requierSignin from '../middlewares/requireSignIn'


const router = express.Router()


router.get('/', requierSignin, getPayPeriods)

router.get('/current', requierSignin, getCurrentPayPeriodState)

router.post( '/create-initial-pay-period', requierSignin, createInitialPayPeriod)

router.post( '/create-pay-period', requierSignin, createPayPeriod)

router.put('/update-pay-period', requierSignin, updatePayPeriod)


function getPayPeriods(req, res, next) {
  payPeriodModel
  .find({refUser: req.user.id})
  .sort("createddAt")
  .exec( (err, data) => {
    if(err) return next(err)
    res.send(data)
  })
}

function calculateBudgetHealth(payPeriods) {
  if (payPeriods.length <= 1) return currency(0).format()
  return payPeriods
    .map( x => x.remainingBudget )
    .reduce( (a,b) => currency(a).add(b), 0 )
    .format()
}

function getCurrentPayPeriodState(req, res, next) {
  payPeriodModel
  .find({refUser: req.user.id})
  .sort("createddAt")
  .exec( (err, data) => {
    if(err) return next(err)
    res.send({
      payPeriod: data[data.length-1],
      budgetHealth: calculateBudgetHealth(data)})
  })
}

function createInitialPayPeriod(req, res, next) {
  const {pay, remainingBudget} = req.body;

  payPeriodModel
    .create({ refUser: mongoose.Types.ObjectId(req.user.id), pay, remainingBudget}, (err, data) => {
    if(err) return next(err)
    res.send(data)
  })  

}

async function createPayPeriod(req, res, next) {
  const { pay, remainingBudget, continuedFixedSpendings, continuedGoals, prevPayPeriodID } = req.body

  const session = await mongoose.startSession()

  session.startTransaction()

  try {

    // create new payperiod
    const payPeriod = await payPeriodModel.create({pay})

    // udpate previous PayPeriod remainingBudget
    await payPeriodModel.findByIdAndUpdate(prevPayPeriodID, {remainingBudget})

    // update emr fund
     emrFundModel.find({}).exec( (err, data) => {
      if(err) return next(err)
      const emrFund = data[0]
      emrFundModel
        .findOneAndUpdate(emrFund._id, {remainingBalance: currency(emrFund.remainingBalance).add(emrFund.commitmentAmount)})
        .exec( (err, data) => {
          if(err) return next(err)
        })
    })

    //update continuedFixedSpendings
    if(continuedFixedSpendings.length > 0) {
      await fixedSpendingModel.updateMany({ _id: {$in: [...continuedFixedSpendings]}}, { $push: {refPayPeriods: payPeriod._id} } ).session(session)
    }

    // update continuedGoals
    if(continuedGoals.length > 0) {
      await goalModel.updateMany({ _id: {$in: [...continuedGoals]}}, { $push: {refPayPeriods: payPeriod._id} } ).session(session)
    }

    await session.commitTransaction();

    res.send({status: "ok"})
    
  } catch (error) {
    await session.abortTransaction()
    next(error)
    
  } finally {
    session.endSession()
  }

}

function updatePayPeriod(req, res, next) {
  const {remainingBudget, payPeriodID, pay} = req.body;

  payPeriodModel.findByIdAndUpdate(payPeriodID, {pay, remainingBudget})
  .exec( err => {
    if(err) return next(err)
  })

}

export default router