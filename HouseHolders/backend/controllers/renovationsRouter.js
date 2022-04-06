const renovationsRouter = require('express').Router()
const Renovation = require('../models/Renovations/renovation.js')
const User = require('../models/Users/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {

  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}


renovationsRouter.get('/', async (request, response, next) => {
  const token = getTokenFrom(request)

  if (token === null ){
    const renos = await Renovation.find({}).populate('user', { username: 1, name: 1 })
    response.json(renos.map(reno => reno.toJSON()))
    return
  }
  const decodedToken = jwt.verify(token, process.env.SECRET) // varmistaa tokenin oikeellisuuden
  
    try {
      const allRenovations = await Renovation.find({}).populate('user', { username: 1, name: 1 })

     if (allRenovations.length > 0) {
      const renovations = (allRenovations.filter(reno => reno.user.id === decodedToken.id))
      response.json(renovations.map(reno => reno.toJSON()))
     } else {
       const renovations = []
       return response.json(renovations.map(reno => reno.toJSON()))
     }
      

    
    } catch(error) {
      next(error)
    }
  })
  
renovationsRouter.post('/', async (request,response,next) => {
  const body = request.body

  const token = getTokenFrom(request)

  const decodedToken = jwt.verify(token, process.env.SECRET) // varmistaa tokenin oikeellisuuden
  if (!token || !decodedToken.id){   // jos tokenia ei ole, tai dekoodattu tokeni ei sisällä käyttäjäst kertovaa id:t -> error

    return response.status(401).json({error: 'Token missing or invalid'})
  }
  try {
      let today = new Date()
      let date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()
      const user = await User.findById(decodedToken.id)
      console.log('body ', body.date)
      const newReno = new Renovation ({
        project: body.project,
        details: body.details,
        showDetails: body.showDetails,
        company: body.company,
        startDate: body.startDate,
        finishedDate: null,
        status: body.status,
        materialBudget: body.materialBudget,
        workBudget: body.workBudget,
        otherBudget: body.otherBudget,
        user: user._id
        
      })
      const savedRenovation = await newReno.save()
      user.renovations = user.renovations.concat(savedRenovation._id)
      console.log('New renovation' , newReno)
      await user.save()
  
     
      response.json(savedRenovation.toJSON())
      } catch(expection) {
        next(expection)
      }
       // mongoose.connection.close()
    })
  
   renovationsRouter.put('/:id', async (request, response) => {
      const { body } = request
      const { id } = request.params
    
      const reno = {
        finishedDate: body.finishedDate,
        status: body.status,
        showDetails: body.showDetails
      }
    
      const updateReno = await Renovation.findByIdAndUpdate(id, reno, { new: true })
     
    
      if (updateReno) {
        response.status(200).json(updateReno.toJSON())
      } else {
        response.status(404).end()
      }
    })

    renovationsRouter.delete('/:id', async (request, response) => {
 
      const id = request.params.id
      console.log('Deleted id ' , id)
      const mainte = await Renovation.findById(id)
      console.log('removing maintenance: ' , mainte)
      await Renovation.findByIdAndDelete(id)
  
      return response.status(204).end()
  
  
    
  })


module.exports = renovationsRouter //tämä