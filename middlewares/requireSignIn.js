import UserCollection from '../models/user'

// todo : implement protected routes
import jwt from 'jwt-simple'
import config from 'config'

export default function auth(req, res, next) {
  const token = req.get('x-auth-token')

  if (!token) return res.status(401).send('Access denied. No token provided.')

  try {
    const decoded = jwt.decode(token, config.get('jwtSecret'));
    
    UserCollection.findById(decoded.id, (err, user) => {
      if(err) return res.status(500).send({error: {message: "Server Error"}})
      if(!user) return res.status(401).send({error: {message: `Did not find user with username of `}})
      req.user = user
      return next()

    })

  }
  catch (err) {
    console.log(err)
    res.status(400).send('Invalid token.');
  }

}