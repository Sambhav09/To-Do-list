const mongoose = require('mongoose')

const ListSchema = new mongoose.Schema({
    todo: String
})

const TodoModel = new mongoose.model("todo", ListSchema)
module.exports = TodoModel