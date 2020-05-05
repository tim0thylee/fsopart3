const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('body', function getId (req) {
    if (req.method === 'POST') return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())


let persons = [
    {
        name: 'Arto Hellas',
        number: '244-424-4213',
        id: 1
    },
    {
        name: 'John Chan',
        number: '123-456-7890',
        id: 2
    },
    {
        name: 'April Ludgate',
        number: '111-111-1111',
        id: 3
    },
    {
        name: 'Tom Bean',
        number: '222-222-2222',
        id: 4
    },
]

app.get('/info', (req, res) => {
    const siteHeader = `<div>Phonebook has info for ${persons.length} people</div>`
    const siteBody = `<div>${new Date()}</div>`
    const info = siteHeader + siteBody

    res.send(info)
})

app.get('/persons', (req, res) => {
    res.json(persons)
})

app.get('/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
    
})

app.delete('/persons/:id', (req, res) => {
    let id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/persons', (req, res) => {
    const person = req.body
    if (!person.name || !person.number) {
        return res.status(400).json({
            error: 'Fill your both name and number'
        })
    }
    if(persons.find(duplicate => duplicate.name === person.name)) {
        return res.status(400).json({
            error: 'Name must be unique'
        })
    }
    const randId = Math.floor(Math.random() * 10000000 + 1)
    person.id = randId

    persons = [...persons, person]
    res.json(person)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})