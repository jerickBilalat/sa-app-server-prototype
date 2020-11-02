import express from 'express'
import payPeriodModel from '../models/payPeriod'
import currency from 'currency.js'
import mongoose from 'mongoose'
import fixedSpendingModel from '../models/fixedSpending'
import goalModel from '../models/goal'
import emrFundModel from '../models/emergencyFund'
import requierSignin from '../middlewares/requireSignIn'
import userModel from '../models/user'


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

async function createInitialPayPeriod(req, res, next) {
 
  const session = await mongoose.startSession()
  session.startTransaction()

  try {

    // create INITIAL payperiod
    const pay = currency(req.body.pay)
    const payPeriod = await payPeriodModel.create({refUser: mongoose.Types.ObjectId(req.user.id), pay})

    // update user settings to to apply ermCommitment amount to emrRemainingBalance
    const userSettings = await userModel.findById(req.user.id).exec()

    await userModel
      .findOneAndUpdate(req.user.id, {emrRemainingBalance: userSettings.emrCommitmentAmount})
      .exec()

    await session.commitTransaction();

    res.send({status:'ok'})
    
  } catch (error) {
    await session.abortTransaction()
    next(error)
    
  } finally {
    session.endSession()
  }
  

}

async function createPayPeriod(req, res, next) {
  const { pay, remainingBudget, continuedFixedSpendings, continuedGoals, prevPayPeriodID } = req.body
  const userID = req.user.id

  const session = await mongoose.startSession()

  session.startTransaction()

  try {

    // create new payperiod
    const newPayPeriod = await payPeriodModel.create({refUser: mongoose.Types.ObjectId(userID), pay})

    // udpate previous PayPeriod remainingBudget
    if(prevPayPeriodID) {
      await payPeriodModel.findByIdAndUpdate(prevPayPeriodID, {remainingBudget})
    }

    // update user settings to to apply ermCommitment amount to emrRemainingBalance
    const userSettings = await userModel.findById(userID).exec()
    
    await userModel
      .findOneAndUpdate({ _id: userID}, {emrRemainingBalance: currency(userSettings.emrCommitmentAmount).add(userSettings.emrRemainingBalance)}, {new: true})
      .exec()

    //update continuedFixedSpendings
    if(continuedFixedSpendings.length > 0) {
      await fixedSpendingModel.updateMany({ _id: {$in: [...continuedFixedSpendings]}}, { $push: {refPayPeriods: newPayPeriod._id} } ).session(session)
    }

    // update continuedGoals
    if(continuedGoals.length > 0) {
      await goalModel.updateMany({ _id: {$in: [...continuedGoals]}}, { $push: {refPayPeriods: newPayPeriod._id} } ).session(session)
    }

    await session.commitTransaction();

    res.send({status:'ok'})
    
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