import express from 'express'
import goalModel from '../models/goal'
import mongoose from 'mongoose'
import requierSignin from '../middlewares/requireSignIn'

const router = express.Router()


router.get('/',requierSignin, getGoals)

router.get('/by-pay-period',requierSignin, getGoalsByPayPeriodId)

router.post('/create-goal',requierSignin, createGoal)

router.put('/update-goal',requierSignin, updateGoal)

function getGoals(req, res, next) {
  goalModel
  .find({refUser: req.user.id})
  .sort("createddAt")
  .exec( (err, data) => {
    if(err) return next(err)
    res.send(data)
  })
}

function createGoal(req, res, next) {
  const {description, amount, payPeriodId} = req.body;

  goalModel.create({description, amount, refPayPeriods: [payPeriodId], refUser: mongoose.Types.ObjectId(req.user.id) }, (err, data) => {
    if(err) return next(err)
    res.send(data)
  })  

}

function getGoalsByPayPeriodId(req, res, next) {
  const {payPeriodId} = req.query;
  goalModel
    .find({ refPayPeriods: {$all:[payPeriodId]}, refUser: req.user.id })
    .exec( (err, data) => {
      if(err) return next(err)
      res.send(data)
    })
}

function updateGoal(req, res, next) {

  const { id, description, payPeriodId} = req.body
  goalModel
    .findByIdAndUpdate(id, {description, $addToSet: { refPayPeriods: payPeriodId}}, {new: true} )
    .exec( (err, data) => {
      if(err) return next(err)
      res.send(data)
    })
}

export default router