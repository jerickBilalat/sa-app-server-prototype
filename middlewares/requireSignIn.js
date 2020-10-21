
// todo : implement protected routes
import jwt from 'jwt-simple'
import config from 'config'

export default function auth(req, res, next) {
  const token = req.get('x-auth-toke')

  if (!token) return res.status(401).send('Access denied. No token provided.')

  try {
    const decoded = jwt.decode(token, config.get('jwtSecret'));
    req.user = decoded;
    next();
  }
  catch (err) {
    console.log(err)
    res.status(400).send('Invalid token.');
  }

}