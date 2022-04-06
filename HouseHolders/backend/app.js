const express = require('express')
const app = express()
const cors = require('cors')
const renovationsRouter = require('./controllers/renovationsRouter')
const mongoose = require('mongoose')
const maintenancesRouter = require('./controllers/maintenancesRouter')
const completedMaintenancesRouter = require('./controllers/completedMaintenancesRouter')
const usersRouter = require('./controllers/usersRouter')
const loginRouter = require('./controllers/loginRouter')




const password = process.argv[2]  
const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(result => {
  console.log('connected to MongoDB')
})
.catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
})

app.use(cors())
app.use(express.json())

app.use('/renovations', renovationsRouter)
app.use('/maintenances', maintenancesRouter)
app.use('/users', usersRouter)
app.use('/login', loginRouter)
app.use('/completedMaintenances', completedMaintenancesRouter)

module.exports = app


