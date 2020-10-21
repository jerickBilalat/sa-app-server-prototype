import express from 'express'
import goalModel from '../models/goal'

const router = express.Router()


router.get('/', getGoals)

router.get('/by-pay-period', getGoalsByPayPeriodId)

router.post('/create-goal', createGoal)

router.put('/update-goal', updateGoal)

function getGoals(req, res, next) {
  goalModel
  .find()
  .sort("createddAt")
  .exec( (err, data) => {
    if(err) return next(err)
    res.send(data)
  })
}

function createGoal(req, res, next) {
  const {description, amount, payPeriodId} = req.body;

  goalModel.create({description, amount, refPayPeriods: [payPeriodId] }, (err, data) => {
    if(err) return next(err)
    res.send(data)
  })  

}

function getGoalsByPayPeriodId(req, res, next) {
  const {payPeriodId} = req.query;
  goalModel
    .find({ refPayPeriods: {$all:[payPeriodId]} })
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