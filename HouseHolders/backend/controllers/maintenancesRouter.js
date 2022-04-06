const maintenancesRouter = require('express').Router()
const Maintenance = require ('../models/Maintenances/maintenance')
const User = require('../models/Users/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

maintenancesRouter.get('/', async (request,response, next) => {
    const token = getTokenFrom(request)

    if (token === null ){
      const maintsut = await Maintenance.find({}).populate('user', { username: 1, name: 1 })
      return response.json(maintsut.map(mainte => mainte.toJSON()))

    }
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET) // varmistaa tokenin oikeellisuuden

      const allMaintenances = await Maintenance.find({}).populate('user', { username: 1, name: 1 })

     if (allMaintenances.length > 0) {
      const maintenances = (allMaintenances.filter(mainte => mainte.user.id === decodedToken.id))
      response.json(maintenances.map(item => item.toJSON()))

     } else {
       console.log('No maintenances')
       const maintenances = []
       return response.json(maintenances.map(item => item.toJSON()))
     }

    }catch(error){
      next(error)
    }
  })

  maintenancesRouter.get('/:id', async (request,response, next) => {
    const id = request.params.id
    try {
      const maintenance = await Maintenance.findById(id)
      response.json(maintenance)
    }catch(error){
      next(error)
    }
  })

  maintenancesRouter.post('/', async (request,response,next) => {
    const body = request.body

    const token = getTokenFrom(request)

    const decodedToken = jwt.verify(token, process.env.SECRET) // varmistaa tokenin oikeellisuuden
    if (!token || !decodedToken.id){   // jos tokenia ei ole, tai dekoodattu tokeni ei sisällä käyttäjäst kertovaa id:t -> error

      return response.status(401).json({error: 'Token missing or invalid'})
    }

    try {

      const user = await User.findById(decodedToken.id)

      const newMaintenance = new Maintenance ({
        task: body.task,
        when: body.when,
        lastTime: body.lastTime,
        cost: body.cost,
        user: user._id
  
      })
    const savedMaintenance = await newMaintenance.save()
    console.log('savedMa', savedMaintenance)
    user.maintenances = user.maintenances.concat(savedMaintenance._id)
    await user.save()

    response.json(savedMaintenance.toJSON())

    } catch(expection) {
      next(expection)
    }
     // mongoose.connection.close()
  })

  maintenancesRouter.put('/:id', async (request, response) => {
    const { body } = request
    const { id } = request.params
    const maintenance = {
      lastTime: body.lastTime,
      cost: body.cost
    }
  
    const updateMaintenance = await Maintenance.findByIdAndUpdate(id, maintenance, { new: true })
    console.log('updating maintenances', updateMaintenance)
  
    if (updateMaintenance) {
      response.status(200).json(updateMaintenance.toJSON())
    } else {
      response.status(404).end()
    }
  })

  maintenancesRouter.delete('/:id', async (request, response) => {
    const body = request.body
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET) // varmistaa tokenin oikeellisuuden
    if (!token || !decodedToken.id){   // jos tokenia ei ole, tai dekoodattu tokeni ei sisällä käyttäjäst kertovaa id:t -> error

      return response.status(401).json({error: 'Token missing or invalid'})
    }

    
    try {
      const id = request.params.id

      const mainte = await Maintenance.findById(id)
      
      if (decodedToken.id == mainte.user) {
        console.log('removing maintenance: ' , mainte)
        console.log('-----')
        console.log('removed maitennace id ' , id)
        const deletedMaintenance = await Maintenance.findByIdAndDelete(id)
        console.log('del mainte ' , deletedMaintenance)
        if (deletedMaintenance)
        return response.status(204).end()

      } else {
        console.log('no permission')
      }
    
    } catch(error){
      console.log('error deleting maintenance, ' , error)
    }



  
})


module.exports = maintenancesRouter //tämä