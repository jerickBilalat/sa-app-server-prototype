import UserCollection from '../models/user'

export default function (req, res, next) {
  const {username, password} = req.body

  // todo sanitize input
  UserCollection.findOne({username}, (err, user) => {
    if(err) return res.status(500).send({error: {message: "Server Error"}})
    if(!user) return res.status(401).send({error: {message: `Did not find user with username of ${username}`}})

    user.comparePassword( password, (err, isMatch) => {
      if(err) return res.status(500).send({error: {message: "Server Error"}})
      if(!isMatch) return res.status(401).send({error: {message: "Invalid Password"}})
      req.user = user
      return next()
    })

  })
}