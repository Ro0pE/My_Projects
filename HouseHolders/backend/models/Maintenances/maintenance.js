const mongoose = require('mongoose')

const maintenanceSchema = new mongoose.Schema({
    task: String,
    when: Number,
    lastTime: Date,
    cost: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

})

maintenanceSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v

    }
})
const Maintenance = mongoose.model('Maintenance', maintenanceSchema)
module.exports = Maintenance

