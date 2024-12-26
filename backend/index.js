const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const Todo = require('./Models/Todo')

const app = express()

app.use(bodyParser.json())
app.use(cors({
    origin: "http://localhost:5173"
}))

mongoose.connect("mongodb+srv://jsambhav2004:VMaFmgC7ORPzdLZI@password.gulmh.mongodb.net/todo", {
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB connection error: ", err));

app.post('/list', async (req, res) => {
    try {
        const data = new Todo(req.body)
        await data.save()
        res.json(data)
    } catch (error) {
        console.log(error)
    }
})

app.get('/list', async (req, res) => {
    try {
        const data = await Todo.find()
        res.json(data)
    } catch (error) {
        res.json(error)
    }
})

app.put('/list/:id', async (req, res) => {
    try {
        const updatedEntry = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(updatedEntry)
    } catch (error) {
        res.json({ error: error.message })
    }
})

app.delete('/list/:id', async (req, res) => {
    try {
        const deletedUser = await Todo.findByIdAndDelete(req.params.id)
        res.json(deletedUser)
    } catch (error) {
        console.error(error)
    }
})

app.listen(3000, () =>
    console.log('Server is running on port 3000')
)