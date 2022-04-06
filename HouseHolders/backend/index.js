
require('dotenv').config()
const express = require('express')
const app = require('./app')
const mongoose = require('mongoose')
const http = require('http')
const server = http.createServer(app)

const renovationsRouter = require('./controllers/renovationsRouter')
const completedMaintenancesRouter = require('./controllers/completedMaintenancesRouter')
const maintenancesRouter = require('./controllers/maintenancesRouter')
const usersRouter = require('./controllers/usersRouter')
const loginRouter = require('./controllers/loginRouter')

app.use(express.static('build'))


//const password = process.argv[2]  


const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(result => {
  console.log('connected to MongoDB')
})
.catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
})



app.use(express.json())
app.use('/completedMaintenances', completedMaintenancesRouter)
app.use('/renovations', renovationsRouter)
app.use('/maintenances', maintenancesRouter)
app.use('/users', usersRouter)
app.use('/login', loginRouter)


const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port :::::: ${PORT}`)
})