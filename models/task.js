const mongoose = require("mongoose")

//defining schema 
const taskSchema = new mongoose.Schema({
    name: String,
    isComplete: Boolean,
})

const Task = mongoose.model("Task", taskSchema)//create model
module.exports = Task; // export the file 