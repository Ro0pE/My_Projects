const mongoose = require('mongoose')

const completedMaintenanceSchema = new mongoose.Schema({
    task: String,
    lastTime: Date,
    cost: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

})

completedMaintenanceSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v

    }
})
const CompletedMaintenance = mongoose.model('CompletedMaintenance', completedMaintenanceSchema)
module.exports = CompletedMaintenance
