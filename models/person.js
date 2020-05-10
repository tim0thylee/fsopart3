require('dotenv').config()
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true);

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB', error.message)
     })

const personSchema = new mongoose.Schema({
  name: {
      type:String, 
      required: true, 
      unique: true,
      minlength: 3
  },
  number:{ 
      type: String,
      minlength: 8
  },
})
personSchema.plugin(uniqueValidator);

// since id is an object, we want to guarantee the value is a string. 
// we also don't want to send back __V. 
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)

