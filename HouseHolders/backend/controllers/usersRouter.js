const bcrypt = require('bcrypt')
const usersRoutes = require('express').Router()
const User = require('../models/Users/user')
const Renovation = require('../models/Renovations/renovation')



usersRoutes.get('/', async (request, response) => {
    const users = await User.find({}).populate('maintenances', {task:1,when:1,lastTime:1,cost:1}).populate('completedMaintenances', {task:1,lastTime:1,cost:1}).populate('renovations', {project:1,details:1,showDetails:1,company:1,status:1,materialBudget:1,workBudget:1,otherBudget:1, startDate:1, finishedDate:1})
    const renos = await Renovation.find({})
    return response.json(users.map(user => user.toJSON()))
  
})

usersRoutes.post('/', async (request,response) => {
    try {
    const body = request.body

    if (!body.username){
        return response.status(400).json({error: 'Username must exists'})
    }

    if (body.username.length < 3){
        return response.status(400).json({error: 'Username must be 3 or more characters long.'})
    }
    const usernameInUse = await User.findOne({username: body.username})

    if (usernameInUse){
        return response.status(400).json({error:'Username already in use'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User ({
        username: body.username,
        name: body.name,
        passwordHash,
    })
    const savedUser = await user.save()  
    return response.status(201).json(savedUser)  // palauta, muoto, useri

    }catch(error){
        console.log('error ', error)

    return response.status(500).send({ error: "Something went wrong.." })
}
 })








module.exports = usersRoutes