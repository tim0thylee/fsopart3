require('dotenv').config()
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true);


// if ( process.argv.length<3 ) {
//   console.log('give password as argument')
//   process.exit(1)
// }

// const password = process.argv[2]
// const userName = process.argv[3]
// const userNumber = process.argv[4]

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

