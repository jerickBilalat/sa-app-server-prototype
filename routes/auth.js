


import jwt from 'jwt-simple'
import express from 'express'
import config from 'config'
import User from '../models/user'
import authMiddleware from '../middlewares/auth'
import requireSignIn from '../middlewares/requireSignin'



const router = express.Router()
const secret = config.get('jwtSecret')


router.post('/signin',
  authMiddleware,
  signInHandler )

router.post('/register', registerUserHandler)

router.get('/get_user', requireSignIn, getUserSettingsHandler)

function signInHandler(req, res, next) {
  const {username, _id: id, emrtype, emrRemainingBalance, averagePayPerPeriod, numberOfPayPeriodPerMonth, emrCommitmentAmount } = req.user,
        token = generateToken(req.user)
  res.send({user: {username: capitalize(username), id, emrtype, emrRemainingBalance, averagePayPerPeriod, numberOfPayPeriodPerMonth, emrCommitmentAmount}, token })
}

function registerUserHandler(req, res, next) {
  const {username, password, emrtype, emrRemainingBalance, averagePayPerPeriod, numberOfPayPeriodPerMonth, emrCommitmentAmount} = req.body
  // todo validation or sanitize input
  User.findOne({username}, (err, existingUser) => {

    if(err) return next(err)
    
    if(existingUser) return res.status(422).send({error: {message: "Name or email is already in use"}})

    const user = new User({username, password, emrtype, emrRemainingBalance, averagePayPerPeriod, numberOfPayPeriodPerMonth, emrCommitmentAmount})

    user.save(err => {

      if(err) return next(err)

      res.json({user: {username: user.username, id: user._id, emrtype: user.emrtype, emrRemainingBalance: user.emrRemainingBalance, averagePayPerPeriod: user.averagePayPerPeriod, numberOfPayPeriodPerMonth: user.numberOfPayPeriodPerMonth, emrCommitmentAmount: user.emrCommitmentAmount}, token: generateToken(user)})
    })

  })
}

function getUserSettingsHandler(req, res, next) {
  const {username, _id: id, emrtype, emrRemainingBalance, averagePayPerPeriod, numberOfPayPeriodPerMonth, emrCommitmentAmount } = req.user
  res.send({username: capitalize(username), id, emrtype, emrRemainingBalance, averagePayPerPeriod, numberOfPayPeriodPerMonth, emrCommitmentAmount})
}

function generateToken(user) {
  const timestamp = Math.round(Date.now() / 1000)
  
  return jwt.encode({ sub: user._id, iat: timestamp, username: capitalize(user.username), id: user._id}, secret)
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default router