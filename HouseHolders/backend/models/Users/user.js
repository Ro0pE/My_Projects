const mongoose = require('mongoose')
//const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    passwordHash: String,
    renovations:[
      {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Renovation'
      }
    ],
    maintenances:[
      {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Maintenance'
      }
    ],
    completedMaintenances:[
      {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'CompletedMaintenance'
      }
    ]
    
  })
 // userSchema.plugin(uniqueValidator)

  userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      delete returnedObject.passwordHash  // piilotetaan passu
    }
  })
  
  const User = mongoose.model('User', userSchema)
  
  module.exports = User
