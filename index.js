import express from 'express'
import config from 'config'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'

// routes
import payPeriodRoutes from './routes/payPeriod'
import spendingTransactionRoutes from './routes/spendingTransaction'
import fixedSpendingRoutes from './routes/fixedSpending'
import goalRoutes from './routes/goal'
import emergencyFundRoutes from './routes/emergencyFund'
import authRoutes from './routes/auth'

mongoose
  .connect(config.get('db_with_replica_sets'), {useNewUrlParser: true, useUnifiedTopology: true})
  .then( () => {
    console.log('DB Connection Successful')
  })
  .catch( err => {
    console.log('DB Connection Error: ', err.message )
  })

const app = express()

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());

if(config.util.getEnv('NODE_CONFIG_ENV') === "development") {
  app.use(morgan('tiny'))
}
app.use('/api/pay-period', payPeriodRoutes)
app.use('/api/spending-transaction', spendingTransactionRoutes)
app.use('/api/fixed-spending', fixedSpendingRoutes)
app.use('/api/goal', goalRoutes)
app.use('/api/emergency-fund/', emergencyFundRoutes)
app.use('/api/auth', authRoutes)


app.get("/", (req, res) => {
  res.json({
    "message": "hello"
  })
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// log errors 
app.use(function(err, req, res, next) {
  console.error(err);
  next(err);
})
// error handlers
app.use(function(err, req, res, next) {

  if (app.get('env') === 'development') {
    res.status(err.status || 500)
      .send({
        message: err.message,
        error: err
      });
    return;
  }

  res.status(err.status || 500)
    .send({
      message: err.message,
      error: {}
    });

});


const PORT = process.env.PORT || config.get('port') || 8080;
app.listen(PORT, () => { console.log(`Server running ${config.util.getEnv('NODE_CONFIG_ENV')} at port ${PORT} with the database ${config.get('db_with_replica_sets')}`)})