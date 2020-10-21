


import jwt from 'jwt-simple'
import express from 'express'
import config from 'config'
import User from '../models/user'
import authMiddleware from '../middlewares/auth'



const router = express.Router()
const secret = config.get('jwtSecret')


router.post('/signin',
  authMiddleware,
  signInHandler )

router.post('/register', registerUserHandler)



function signInHandler(req, res, next) {
  const {name, _id} = req.user,
        token = generateToken(req.user)
  res.send({user: {name: capitalize(name), _id}, token })
}

function registerUserHandler(req, res, next) {
  const {name, password} = req.body
  // todo validation or sanitize input
  User.findOne({name}, (err, existingUser) => {

    if(err) return next(err)
    
    if(existingUser) return res.status(422).send({error: {message: "Name is already in use"}})
    
    // todo player sync with existing player record
    // if(Player.findOne({name}, (err, player) => {...}))

    const user = new User({
      name,
      password
    })

    user.save(err => {

      if(err) return next(err)

      res.json({user: {name: user.name, _id: user._id}, token: generateToken(user)})
    })

  })
}

function generateToken(user) {
  const timestamp = Math.round(Date.now() / 1000)
  if(user.admin) {
    // todo : another handler to expire login
    // const tenHours = Math.round(Date.now() / 1000 + 10 * 60 * 60)
    return jwt.encode({ sub: user._id, iat: timestamp, admin: true, name: capitalize(user.name) }, secret)
  }
  
  return jwt.encode({ sub: user._id, iat: timestamp, name: capitalize(user.name)}, secret)
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default router