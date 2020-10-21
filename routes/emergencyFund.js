import express from 'express'
import emergencyFundModel from '../models/emergencyFund'
import currency from 'currency.js'

const router = express.Router()


router.get('/', getEmergencyFund)

router.post( '/create-emergency-fund', createEmergencyFund)

router.put('/update-emergency-fund', updateEmergencyFund)


function getEmergencyFund(req, res, next) {
  
  emergencyFundModel
  .find()
  .exec( (err, data) => {
    if(err) return next(err)
    if(!data[0]) res.send({ type: 3, remainingBalance: "0.00", numberOfPayPeriodPerMonth: 2, commitmentAmount: "0.00", _id: 0, goalAmount: "0.00"})
    const {type, remainingBalance, numberOfPayPeriodPerMonth, commitmentAmount, _id, averagePayPerPeriod} = data[0] && {}
    res.send({ type, remainingBalance, numberOfPayPeriodPerMonth, commitmentAmount, _id, goalAmount: currency(averagePayPerPeriod).multiply(numberOfPayPeriodPerMonth * type).format() })
  })

}


function createEmergencyFund(req, res, next) {
  const {type, averagePayPerPeriod, remainingBalance, numberOfPayPeriodPerMonth, commitmentAmount} = req.body;

  emergencyFundModel.create({type, averagePayPerPeriod, remainingBalance, numberOfPayPeriodPerMonth}, (err, data) => {
    if(err) return next(err)
    res.send(data)
  })  

}

function updateEmergencyFund(req, res, next) {
  const {type, averagePayPerPeriod, remainingBalance, numberOfPayPeriodPerMonth, emergencyFundID, commitmentAmount} = req.body;

  emergencyFundModel.findByIdAndUpdate(emergencyFundID, {type, averagePayPerPeriod, remainingBalance, numberOfPayPeriodPerMonth})
  .exec( err => {
    if(err) return next(err)
  })

}

export default router