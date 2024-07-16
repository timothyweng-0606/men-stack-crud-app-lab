
//Connect to mongodb 
const dotenv = require("dotenv")// require package
dotenv.config(); // Loads the environment variables from .env file
const mongoose = require("mongoose")
// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI)
const express = require('express')
const app = express()
const methodOverride = require("method-override")
const morgan = require("morgan")
const path = require("path")


mongoose.connect(process.env.MONGODB_URI)
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})
//Import Task Model Schema
const Task = require("./models/task.js")
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method"))
app.use(morgan("dev"))

app.use(express.static(path.join(__dirname, "public")))

app.listen(3000, () => {
    console.log("Listening on port 3000")
})


//root route
app.get("/", async (req, res) => {
    res.render("index.ejs") // use render to display ejs file 
  })

//index route which display all tasks
app.get("/tasks",async(req, res) => {
    const allTasks = await Task.find()
    // The first argument is a string specifying the path to the EJS template we wish to render.
    // The second argument is an object containing the data we want to pass to the template. This data is provided as key/value pairs, where the key is the name we’ll use to reference the data in our EJS template.
    res.render("tasks/index.ejs", {tasks: allTasks})//allTasks data type array obj. [{},{},{}]
  });

//POST
app.post("/tasks", async (req, res) => {
    if (!req.body.name) {
        res.redirect('/tasks/new?error=1'); // Redirect to new task form with error query parameter
        return;
      }
    req.body.isComplete = req.body.isComplete === 'on';
    //pass in the data to the database from the user, create is an asynchronous operation; we use await to ensure the database operation completes before the function continues.
    await Task.create(req.body)
    res.redirect("/tasks")
  });

//new task route
app.get("/tasks/new", (req, res) => {
    res.render("tasks/new.ejs")
})

//detail of each task route
app.get("/tasks/:taskId", async(req, res) => {
    const foundTask = await Task.findById(req.params.taskId)
    res.render("tasks/show.ejs", {task: foundTask})
})
  
//delete route
app.delete("/tasks/:taskId", async (req, res) => {
    await Task.findByIdAndDelete(req.params.taskId);
    res.redirect("/tasks");
  });

//edit the current task 
// GET localhost:3000/tasks/:taskId/edit
app.get("/tasks/:taskId/edit", async (req, res) => {
    const foundTask = await Task.findById(req.params.taskId);
   res.render("tasks/edit.ejs", {task: foundTask})
  });
  
app.put("/tasks/:taskId", async (req, res) => {
    if (req.body.isComplete === "on") {
      req.body.isComplete = true;
    } else {
      req.body.isComplete = false;
    }
    
    // Update the task in the database
    await Task.findByIdAndUpdate(req.params.taskId, req.body);
  
    // Redirect to the task's show page to see the updates
    res.redirect(`/tasks/${req.params.taskId}`);
  });