const completedMaintenancesRouter = require('express').Router()
const CompletedMaintenance = require ('../models/Maintenances/completedMaintenance')
const User = require('../models/Users/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
  }
  
  completedMaintenancesRouter.get('/', async (request,response, next) => {
      const token = getTokenFrom(request)
  
      if (token === null ){
        const maintsut = await CompletedMaintenance.find({}).populate('user', { username: 1, name: 1 })
        return response.json(maintsut.map(mainte => mainte.toJSON()))
  
      }
      try {
        const decodedToken = jwt.verify(token, process.env.SECRET) // varmistaa tokenin oikeellisuuden
  
        const allMaintenances = await CompletedMaintenance.find({}).populate('user', { username: 1, name: 1 })
  
       if (allMaintenances.length > 0) {
        const maintenances = (allMaintenances.filter(mainte => mainte.user.id === decodedToken.id))
        response.json(maintenances.map(item => item.toJSON()))
  
       } else {
         console.log('No completed maintenances')
         const maintenances = []
         return response.json(maintenances.map(item => item.toJSON()))
       }
  
      }catch(error){
        next(error)
      }
    })
  
    completedMaintenancesRouter.get('/:id', async (request,response, next) => {
      const id = request.params.id
      try {
        const maintenance = await CompletedMaintenance.findById(id)
        response.json(maintenance)
      }catch(error){
        next(error)
      }
    })
  
    completedMaintenancesRouter.post('/', async (request,response,next) => {
      const body = request.body
      console.log('body', body)
  
      const token = getTokenFrom(request)
  
      const decodedToken = jwt.verify(token, process.env.SECRET) // varmistaa tokenin oikeellisuuden
      if (!token || !decodedToken.id){   // jos tokenia ei ole, tai dekoodattu tokeni ei sisällä käyttäjäst kertovaa id:t -> error
  
        return response.status(401).json({error: 'Token missing or invalid'})
      }
  
      try {
  
        const user = await User.findById(decodedToken.id)
  
        const newMaintenance = new CompletedMaintenance ({
          task: body.task,
          lastTime: body.lastTime,
          cost: body.cost,
          user: user._id
    
        })
      const savedMaintenance = await newMaintenance.save()
      console.log('savedMa', savedMaintenance._id)
      user.completedMaintenances = user.completedMaintenances.concat(savedMaintenance._id)
      await user.save()
  
      response.json(savedMaintenance.toJSON())
  
      } catch(expection) {
        next(expection)
      }
       // mongoose.connection.close()
    })
  
    completedMaintenancesRouter.put('/:id', async (request, response) => {
      const { body } = request
      const { id } = request.params
      let today = new Date()
      let date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()
    
      const maintenance = {
        lastTime: today,
      }
    
      const updateMaintenance = await CompletedMaintenance.findByIdAndUpdate(id, maintenance, { new: true })
      console.log('update completed Maintenance', updateMaintenance)
    
      if (updateMaintenance) {
        response.status(200).json(updateMaintenance.toJSON())
      } else {
        response.status(404).end()
      }
    })
  
    completedMaintenancesRouter.delete('/:id', async (request, response) => {
      const body = request.body
      const token = getTokenFrom(request)
      const decodedToken = jwt.verify(token, process.env.SECRET) // varmistaa tokenin oikeellisuuden
      if (!token || !decodedToken.id){   // jos tokenia ei ole, tai dekoodattu tokeni ei sisällä käyttäjäst kertovaa id:t -> error
  
        return response.status(401).json({error: 'Token missing or invalid'})
      }
  
      
      try {
        const id = request.params.id
  
        const mainte = await CompletedMaintenance.findById(id)
        
        if (decodedToken.id == mainte.user) {
          console.log('removing maintenance: ' , mainte)
          console.log('-----')
          console.log('removed maitennace id ' , id)
          const deletedMaintenance = await CompletedMaintenance.findByIdAndDelete(id)
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
  
  
  module.exports = completedMaintenancesRouter //tämä