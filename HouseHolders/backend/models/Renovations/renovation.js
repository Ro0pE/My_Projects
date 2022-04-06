const mongoose = require('mongoose')

const renovationSchema = new mongoose.Schema({
    project: String,
    details: String,
    showDetails: Boolean,
    company: String,
    startDate: Date,
    finishedDate: Date,
    status: Boolean,
    materialBudget: Number,
    workBudget: Number,
    otherBudget: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

})

renovationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v

    }
})
const Renovation = mongoose.model('Renovation', renovationSchema)
console.log('renoskema' , Renovation)

module.exports = Renovation
